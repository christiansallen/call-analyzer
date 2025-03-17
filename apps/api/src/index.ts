import { db } from "@call-analyzer/database";
import { users, calls } from "@call-analyzer/database";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { eq } from "drizzle-orm";

dotenv.config({ path: "../../.env" });

const app = express();

app.use(cors());
app.use(express.json());

// Protected routes for database operations
app.post("/api/users", async (req, res) => {
  try {
    const { id, email } = req.body;

    const result = await db
      .insert(users)
      .values({ id, email })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email,
          updatedAt: new Date(),
        },
      })
      .returning();

    res.json(result[0]);
  } catch (error) {
    console.error("Error creating/updating user:", error);
    res.status(500).json({ error: "Failed to create/update user" });
  }
});

app.get("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.select().from(users).where(eq(users.id, id));

    if (!result.length) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result[0]);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

app.post("/api/calls", async (req, res) => {
  try {
    const { userId, phoneNumber, duration, recordingUrl, status, startTime } =
      req.body;

    const result = await db
      .insert(calls)
      .values({
        userId,
        phoneNumber,
        duration,
        recordingUrl,
        status,
        startTime: new Date(startTime),
      })
      .returning();

    res.json(result[0]);
  } catch (error) {
    console.error("Error creating call:", error);
    res.status(500).json({ error: "Failed to create call" });
  }
});

app.get("/api/calls/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await db
      .select()
      .from(calls)
      .where(eq(calls.userId, userId))
      .orderBy(calls.startTime);

    res.json(result);
  } catch (error) {
    console.error("Error fetching calls:", error);
    res.status(500).json({ error: "Failed to fetch calls" });
  }
});

// Error handling middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something broke!" });
  }
);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`API running on port ${port}`);
});

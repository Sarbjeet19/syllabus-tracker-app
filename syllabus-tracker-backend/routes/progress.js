// routes/progress.js (ESM)
import express from "express";
import jwt from "jsonwebtoken";
import Progress from "../models/Progress.js";

const router = express.Router();

// auth middleware
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// GET the user's progress (This is the new, corrected version)
router.get("/", auth, async (req, res) => {
  try {
    let p = await Progress.findOne({ userId: req.userId });

    // If no progress document exists for the user, create one now.
    if (!p) {
      const defaultSubjects = [
        { name: "DSA", topics: [{ name: "Arrays", done: false }] },
        { name: "DBMS", topics: [{ name: "ER Diagram", done: false }] },
      ];
      
      // Create a new Progress document with the default data and save it.
      p = await Progress.create({ userId: req.userId, subjects: defaultSubjects });
    }
    
    // Return the subjects from the saved document (which now have _id's).
    res.json({ subjects: p.subjects });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST (this route is for replacing all subjects, we can keep it for now)
router.post("/", auth, async (req, res) => {
  try {
    const { subjects } = req.body;
    if (!Array.isArray(subjects)) return res.status(400).json({ error: "subjects must be array" });

    const updated = await Progress.findOneAndUpdate(
      { userId: req.userId },
      { subjects },
      { upsert: true, new: true }
    );
    res.json({ subjects: updated.subjects });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST a new subject to the user's list
router.post("/subjects", auth, async (req, res) => {
  const { name, topics } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Subject name is required" });
  }

  const newSubject = {
    name,
    topics: topics || [],
  };

  try {
    const progress = await Progress.findOneAndUpdate(
      { userId: req.userId },
      { $push: { subjects: newSubject } },
      { new: true, upsert: true }
    );
    res.status(201).json(progress.subjects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// PATCH to update a specific topic's 'done' status
router.patch("/subjects/:subjectId/topics/:topicId", auth, async (req, res) => {
  const { subjectId, topicId } = req.params;
  const { done } = req.body;

  if (typeof done !== 'boolean') {
    return res.status(400).json({ error: "'done' must be a boolean" });
  }

  try {
    const progress = await Progress.findOneAndUpdate(
      { "userId": req.userId, "subjects._id": subjectId, "subjects.topics._id": topicId },
      { "$set": { "subjects.$[s].topics.$[t].done": done } },
      {
        arrayFilters: [{ "s._id": subjectId }, { "t._id": topicId }],
        new: true
      }
    );

    if (!progress) {
      return res.status(404).json({ error: "Progress, subject, or topic not found" });
    }

    res.json(progress.subjects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// routes/progress.js

// ... (keep all the existing code) ...


// ADD THIS NEW ROUTE:
// POST a new topic to a specific subject
router.post("/subjects/:subjectId/topics", auth, async (req, res) => {
  const { subjectId } = req.params;
  const { name } = req.body; // Expecting { "name": "New Topic Name" }

  if (!name) {
    return res.status(400).json({ error: "Topic name is required" });
  }

  const newTopic = {
    name,
    done: false,
  };

  try {
    const progress = await Progress.findOneAndUpdate(
      { "userId": req.userId, "subjects._id": subjectId },
      { "$push": { "subjects.$.topics": newTopic } }, // Find the correct subject and push the new topic into its 'topics' array
      { new: true }
    );

    if (!progress) {
      return res.status(404).json({ error: "Subject not found" });
    }

    res.status(201).json(progress.subjects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// routes/progress.js

// ... (keep all the existing code for GET, POST, and PATCH routes) ...


// ADD THIS NEW ROUTE:
// DELETE a specific topic from a specific subject
router.delete("/subjects/:subjectId/topics/:topicId", auth, async (req, res) => {
  const { subjectId, topicId } = req.params;

  try {
    const progress = await Progress.findOneAndUpdate(
      { "userId": req.userId, "subjects._id": subjectId },
      // Use the $pull operator to remove an item from a nested array
      { "$pull": { "subjects.$.topics": { "_id": topicId } } },
      { new: true }
    );

    if (!progress) {
      return res.status(404).json({ error: "Subject not found" });
    }

    res.json(progress.subjects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// routes/progress.js

// ... (keep all the existing code for other routes) ...


// ADD THIS NEW ROUTE:
// DELETE a specific subject from the user's list
router.delete("/subjects/:subjectId", auth, async (req, res) => {
  const { subjectId } = req.params;

  try {
    const progress = await Progress.findOneAndUpdate(
      { userId: req.userId },
      // Use the $pull operator to remove an object from the subjects array
      { "$pull": { "subjects": { "_id": subjectId } } },
      { new: true }
    );

    if (!progress) {
      return res.status(404).json({ error: "User progress not found" });
    }

    res.json(progress.subjects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


export default router;
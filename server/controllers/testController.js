import Test from '../models/Test.js';
import User from '../models/User.js';

export const getTests = async (req, res) => {
  try {
    const user = req.user;
    let tests;

    if (user.role === 'teacher') {
      tests = await Test.find({ createdBy: user._id });
    } else {
      tests = await Test.find({
        branch: user.branch,
        year: user.year
      });
    }

    res.json(tests);
  } catch (error) {
    console.error('Error fetching tests:', error);
    res.status(500).json({ error: 'Failed to fetch tests' });
  }
};

export const getTeacherTestsWithGrades = async (req, res) => {
  try {
    const user = req.user;
    if (user.role !== 'teacher') {
      return res.status(403).json({ error: 'Only teachers can access this' });
    }

    const tests = await Test.find({ createdBy: user._id })
      .populate('grades.studentId', 'name email')
      .sort({ createdAt: -1 });

    res.json(tests);
  } catch (error) {
    console.error('Error fetching teacher tests:', error);
    res.status(500).json({ error: 'Failed to fetch tests' });
  }
};

export const getTestGrades = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (user.role !== 'teacher') {
      return res.status(403).json({ error: 'Only teachers can access grades' });
    }

    const test = await Test.findById(id);
    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }

    if (test.createdBy.toString() !== user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to view these grades' });
    }

    // Get all students from the same branch and year as the test
    const students = await User.find({
      role: 'student',
      branch: test.branch,
      year: test.year
    }).select('name email branch year');

    // Create grade entries for all students
    const gradeEntries = students.map(student => {
      const existingGrade = test.grades.find(
        grade => grade.studentId.toString() === student._id.toString()
      );
      
      return {
        studentId: student,
        score: existingGrade ? existingGrade.score : undefined,
        gradedAt: existingGrade ? existingGrade.gradedAt : undefined
      };
    });

    res.json(gradeEntries);
  } catch (error) {
    console.error('Error fetching test grades:', error);
    res.status(500).json({ error: 'Failed to fetch test grades' });
  }
};

export const gradeTest = async (req, res) => {
  try {
    const { id } = req.params;
    const { studentId, score } = req.body;
    const user = req.user;

    if (user.role !== 'teacher') {
      return res.status(403).json({ error: 'Only teachers can grade tests' });
    }

    if (score < 0 || score > 10) {
      return res.status(400).json({ error: 'Score must be between 0 and 10' });
    }

    const test = await Test.findById(id);
    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }

    if (test.createdBy.toString() !== user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to grade this test' });
    }

    // Check if grade already exists for this student
    const existingGradeIndex = test.grades.findIndex(
      grade => grade.studentId.toString() === studentId
    );

    if (existingGradeIndex !== -1) {
      // Update existing grade
      test.grades[existingGradeIndex].score = score;
      test.grades[existingGradeIndex].gradedAt = new Date();
    } else {
      // Add new grade
      test.grades.push({
        studentId,
        score,
        gradedAt: new Date()
      });
    }

    await test.save();
    res.json({ message: 'Grade saved successfully' });
  } catch (error) {
    console.error('Error grading test:', error);
    res.status(500).json({ error: 'Failed to save grade' });
  }
};

export const createTest = async (req, res) => {
  try {
    const user = req.user;
    if (user.role !== 'teacher') {
      return res.status(403).json({ error: 'Only teachers can create tests' });
    }

    const test = new Test({
      ...req.body,
      createdBy: user._id
    });

    await test.save();
    res.status(201).json(test);
  } catch (error) {
    console.error('Error creating test:', error);
    res.status(500).json({ error: 'Failed to create test' });
  }
};
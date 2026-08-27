import mongoose from "mongoose";


const ResultSchema = new mongoose.Schema({

  userId: {

    type: String,

    required: true

  },


  category: {

    type: String,

    default: "General"

  },


  answers: [

    {

      questionId: String,

      question: String,

      answer: String,


      // AI Evaluation

      score: Number,

      technicalAccuracy: Number,

      communication: Number,

      confidence: Number,


      strengths: [

        String

      ],


      weaknesses: [

        String

      ],


      improvementTips: [

        String

      ]

    }

  ],


  overallScore: {

    type: Number,

    default: 0

  },


  date: {

    type: Date,

    default: Date.now

  }

});


const Result = mongoose.model(
  "Result",
  ResultSchema
);


export default Result;
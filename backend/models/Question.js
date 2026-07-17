import mongoose from "mongoose";


const QuestionSchema = new mongoose.Schema({

  category: {

    type: String,

    required: true

  },


  difficulty: {

    type: String,

    required: true

  },


  question: {

    type: String,

    required: true

  },


  keywords: {

    type: [String],

    default: []

  }

});


const Question = mongoose.model(
  "Question",
  QuestionSchema
);


export default Question;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'Admin'
    },
    totalQuestions: {
        type: Number,
        default: 0
    },
    duration: {
        type: Number,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    totalMarks: {
        type: Number,
        default: 0
    },
    testType: String,
    negative: {
        type: Boolean,
        default: false
    },
    negPercentage: {
        type: Number,
        default: 0,
    },
    studentMarks: [{
        name: {
            type: String,
            required: true
        },
        uniqueID: {
            type: String,
            required: true
        },
        userID: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        marks: {
            type: Number,
            default: 0,
        },
        positiveMarks: {
            type: Number,
            default: 0,
        },
        negativeMarks: {
            type: Number,
            default: 0,
        },
        isEvaluated: {
            type: Boolean,
            default: false,
        },
        answers: [{
            questionNo: {
                type: Number,
            },
            markedAns: {
                type: String,
                default: ''
            },
            marks: {
                type: Number,
                default: 0
            },
            remarks: {
                type: String,
                default: ''
            }
        }],
        file: String,
    }],
    isQuestionInPDF: {
        type: Boolean,
        required: true,
        default: false
    },
    questionPDF: String,
    questions: [{
        questionNo: {
            type: Number,
            required: true
        },
        questionType: {
            type: String,
            default: '1'
        },
        question: {
            type: String,
            required: true
        },
        A: String,
        B: String,
        C: String,
        D: String,
        ans: String,
        marks: {
            type: Number,
            required: true
        }
    }]
}, { timestamps: true });

const Test = mongoose.model('Test', testSchema);

module.exports = Test;

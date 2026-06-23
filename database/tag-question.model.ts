import { Document, model, models, Schema, Types } from "mongoose";

export interface ITagQuestion {
  tagId: Types.ObjectId;
  questionId: Types.ObjectId;
}
export interface ITagQuestionDoc extends ITagQuestion, Document {}
const TagQuestionSchema = new Schema<ITagQuestion>(
  {
    tagId: { type: Schema.Types.ObjectId, ref: "Tag", required: true },
    questionId: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
  },
  { timestamps: true },
);

const TagQuestion =
  models?.TagQuestion || model<ITagQuestion>("TagQuestion", TagQuestionSchema);

export default TagQuestion;

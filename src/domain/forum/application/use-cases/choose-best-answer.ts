import { Question } from "../../enterprise/entities/question"
import { AnswersRepository } from "../repositories/answers-repository" 
import { QuestionRepository } from "../repositories/question-repository"

interface ChooseBestAnswerUseCaseRequest {
  authorId: string
  answerId: string
}

interface ChooseBestAnswerUseCaseResponse {
  question: Question
}

export class ChooseBestAnswerUseCase {
  constructor (
    private questionsRepository: QuestionRepository,
    private answersRepository: AnswersRepository,
  ) {}

  async execute({
    authorId,
    answerId,
  }: ChooseBestAnswerUseCaseRequest): Promise<ChooseBestAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      throw new Error('Answer not found.')
    }

    const question = await this.questionsRepository.findById(answer.questionId.toString())

    if (!question) {
      throw new Error('Question not found.')
    }

    if (authorId !== question.authorId.toString()) {
      throw new Error('Not allowed')
    }

    question.bestAnswerId = answer.id

    await this.questionsRepository.save(question)

    return {
      question,
    }
  }
}
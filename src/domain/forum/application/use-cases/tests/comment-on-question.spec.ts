import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { CommentOnQuestionUseCase } from '../comment-on-question'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionsCommentsRepository: InMemoryQuestionCommentsRepository
let sut: CommentOnQuestionUseCase

describe('Comment on question', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    inMemoryQuestionsCommentsRepository = new InMemoryQuestionCommentsRepository()
    sut = new CommentOnQuestionUseCase(inMemoryQuestionsRepository, inMemoryQuestionsCommentsRepository)
  })

  it('should be to comment on question', async () => {
    const question = makeQuestion()

    await inMemoryQuestionsRepository.create(question)
    
    await sut.execute({
      questionId: question.id.toString(),
      authorId: question.authorId.toString(),
      content: 'test content'
    })
  
    expect(inMemoryQuestionsCommentsRepository.items[0].content).toEqual('test content')
  })
})

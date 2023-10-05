import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { EditQuestionUseCase } from '../edit-question'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: EditQuestionUseCase

describe('Edit question by id', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new EditQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('should be to edit a question', async () => {
    const newQuestion = makeQuestion({
      authorId: new UniqueEntityID('author-1')
    }, new UniqueEntityID('question-1'))
    
    inMemoryQuestionsRepository.create(newQuestion)
    
    await sut.execute({
      authorId: 'author-1',
      questionId: newQuestion.id.toString(),
      title: 'test',
      content: 'test content'
    })
  
    expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
      title: 'test',
      content: 'test content',
    })
  })

  it('should not be able to edit a question from another user', async () => {
    const newQuestion = makeQuestion({
      authorId: new UniqueEntityID('author-1')
    }, new UniqueEntityID('question-1'))
    
    inMemoryQuestionsRepository.create(newQuestion)

    expect(() => {
      return sut.execute({
        authorId: 'author-2',
        questionId: newQuestion.id.toString(),
        title: 'test',
        content: 'test content'
      })
    }).rejects.toBeInstanceOf(Error)

  })
})


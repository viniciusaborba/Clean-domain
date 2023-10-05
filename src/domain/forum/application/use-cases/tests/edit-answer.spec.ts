import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository;'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { EditAnswerUseCase } from '../edit-answer'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: EditAnswerUseCase

describe('Edit answer by id', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new EditAnswerUseCase(inMemoryAnswersRepository)
  })

  it('should be to edit a answer', async () => {
    const newAnswer = makeAnswer({
      authorId: new UniqueEntityID('author-1')
    }, new UniqueEntityID('answer-1'))
    
    inMemoryAnswersRepository.create(newAnswer)
    
    await sut.execute({
      authorId: 'author-1',
      answerId: newAnswer.id.toString(),
      content: 'test content'
    })
  
    expect(inMemoryAnswersRepository.items[0]).toMatchObject({
      content: 'test content',
    })
  })

  it('should not be able to edit a answer from another user', async () => {
    const newAnswer = makeAnswer({
      authorId: new UniqueEntityID('author-1')
    }, new UniqueEntityID('answer-1'))
    
    inMemoryAnswersRepository.create(newAnswer)

    expect(() => {
      return sut.execute({
        authorId: 'author-2',
        answerId: newAnswer.id.toString(),
        content: 'test content'
      })
    }).rejects.toBeInstanceOf(Error)

  })
})


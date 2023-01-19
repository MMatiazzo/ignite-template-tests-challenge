import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { CreateStatementError } from "./CreateStatementError";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

describe("Create Statement Controller", () => {
    beforeEach(async () => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        inMemoryStatementRepository = new InMemoryStatementsRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        createStatementUseCase = new CreateStatementUseCase(
            inMemoryUsersRepository,
            inMemoryStatementRepository
        );
    });
    it("Should be able to create a statement", async () => {

        const { id } = await createUserUseCase.execute({
            name: "user",
            email: "email@email.com",
            password: "password"
        });

        const statement = await createStatementUseCase.execute({
            user_id: id as string,
            type: OperationType.DEPOSIT,
            amount: 1000,
            description: "description"
        });

        console.log('statement => ', statement);

        expect(statement).toHaveProperty("id");
    });

    it("Should not be able withdraw more money than you have on the account", () => {
        expect(async () => {
            const { id } = await createUserUseCase.execute({
                name: "user",
                email: "email@email.com",
                password: "password"
            });
    
            await createStatementUseCase.execute({
                user_id: id as string,
                type: OperationType.DEPOSIT,
                amount: 1000,
                description: "description"
            });

            await createStatementUseCase.execute({
                user_id: id as string,
                type: OperationType.WITHDRAW,
                amount: 1001,
                description: "description"
            });
        }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
    });
});
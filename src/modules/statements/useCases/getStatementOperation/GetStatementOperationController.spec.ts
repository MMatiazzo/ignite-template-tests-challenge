import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceUseCase, IRequest } from "../getBalance/GetBalanceUseCase";
import { IRequestStatementOperation } from "./GetStatementOperationUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getBalanceUseCase: GetBalanceUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get Statement Operation Controller", () => {
    beforeEach(async () => {
        inMemoryUsersRepository = new InMemoryUsersRepository();

        inMemoryStatementRepository = new InMemoryStatementsRepository();

        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

        createStatementUseCase = new CreateStatementUseCase(
            inMemoryUsersRepository,
            inMemoryStatementRepository
        );

        getBalanceUseCase = new GetBalanceUseCase(
            inMemoryStatementRepository,
            inMemoryUsersRepository
        );

        getStatementOperationUseCase = new GetStatementOperationUseCase(
            inMemoryUsersRepository, 
            inMemoryStatementRepository
        );
    });

    it("Should be get a users statement", async () => {

        const { id: user_id } = await createUserUseCase.execute({
            name: "user",
            email: "email@email.com",
            password: "password"
        });

        const { id: statement_id } = await createStatementUseCase.execute({
            user_id: user_id as string,
            type: OperationType.DEPOSIT,
            amount: 1000,
            description: "description"
        });

        const statement = await getStatementOperationUseCase.execute({user_id, statement_id} as IRequestStatementOperation);

        console.log('statement => ', statement)

        expect(statement).toHaveProperty("id");
    });

    it("Should not be able to get a statement for a user that does not exists", async () => {
        await expect(async () => {
            const statement = await getStatementOperationUseCase.execute({user_id: "num-existent-id", statement_id: "num-existent-statement"} as IRequestStatementOperation);
            console.log('statement => ', statement);
        }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
    });
});
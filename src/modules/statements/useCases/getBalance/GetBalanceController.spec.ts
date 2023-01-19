import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceUseCase } from "./GetBalanceUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"; 
import { IRequest } from "./GetBalanceUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { GetBalanceError } from "./GetBalanceError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get Balance Controller", () => {
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
    });

    it("Should be get a users balance", async () => {

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

        const balance = await getBalanceUseCase.execute({user_id: id} as IRequest);

        // console.log('balance => ', balance)

        expect(balance).toHaveProperty("balance");
    });

    it("Should not be able to get a balance for a user that does not exists", async () => {
        await expect(async () => {
            await getBalanceUseCase.execute({user_id: "num-existent-id"} as IRequest);
        }).rejects.toBeInstanceOf(GetBalanceError);
    });
});
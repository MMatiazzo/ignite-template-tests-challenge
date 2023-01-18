import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Authenticate User Controller", () => {

    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    });

    it("Should be able to authenticate an user", async () => {

        await createUserUseCase.execute({
            name: "user",
            email: "email@email.com",
            password: "password"
        });

        const authentication = await authenticateUserUseCase.execute({
            email: "email@email.com",
            password: "password"
        });

        expect(authentication).toHaveProperty("user");
    });

    it("Should not be able to authenticate user with incorrect email or password", () => {
        expect(async () => {
            await createUserUseCase.execute({
                name: "user",
                email: "email@email.com",
                password: "password"
            });
    
            const authentication = await authenticateUserUseCase.execute({
                email: "emailfalse@email.com",
                password: "passwordfalse"
            });
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
    });
});
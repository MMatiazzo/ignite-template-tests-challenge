import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { CreateUserError } from "./CreateUserError";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create User Controller", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    });

    it("Should be able to create a new user", async () => {

        const user = await createUserUseCase.execute({
            name: "user",
            email: "email@email.com",
            password: "password"
        });

        expect(user).toHaveProperty("id");
    });

    it("Should not be able to create an user with an email that already exists", () => {
        expect(async () => {
            await createUserUseCase.execute({
                name: "user",
                email: "email@email.com",
                password: "password"
            });

            await createUserUseCase.execute({
                name: "user2",
                email: "email@email.com",
                password: "password2"
            });

        }).rejects.toBeInstanceOf(CreateUserError);
    });
});
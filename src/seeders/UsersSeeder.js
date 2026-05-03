import { faker } from "@faker-js/faker";
import User from "../models/Users.js";

export const UserSeeder = async () => {
  try {
    await User.deleteMany({});

    const users = [];

    for (let i = 0; i < 10; i++) {
      users.push({
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email().toLowerCase(),
        gender: faker.person.sex(),
        bio: faker.lorem.sentence(),
        addresses: faker.helpers.arrayElement([
          {
            street: faker.location.street(),
            city: faker.location.city(),
            country: faker.location.country(),
            zipCode: faker.location.zipCode(),
          },
          {
            street: faker.location.street(),
            city: faker.location.city(),
            country: faker.location.country(),
            zipCode: faker.location.zipCode(),
          },
        ]),
        password: "Pass123!word!",
      });
    }

    await User.create(users);
    console.log("Successfully created 10 users!");
  } catch (error) {
    console.error("Error seeding data:", error.message);
  }
};

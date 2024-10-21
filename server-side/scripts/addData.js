const { faker } = require('@faker-js/faker');
const { User } = require('../models');

async function addData(){
    const users = [];
    for (let i = 0; i < 5; i++) {
        let firstName = faker.person.firstName();
        users.push({
            name: `${firstName} ${faker.person.lastName()}`,
            email: `${firstName}@gmail.com`,
            password: '123',
            picture: faker.image.avatar()
        });
    }

    await User.bulkCreate(users);
}

addData()
    .then(() => console.log('Script finished'))
    .catch((error) => console.log('Error:', error));
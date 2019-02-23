//Run: npx nodemon index.js
//
let express = require('express');
let bodyParser = require('body-parser');
const {ApolloServer, gql} = require('apollo-server-express');

const app = express();

let s = 1;

const students = [
    {
        id: s++,
        classID: "DIN16",
        name: {
            firstName: "John",
            lastName: "Smith"
        },
        address: {
            street: "Testikatu 1",
            zip: "892435"
        },
        email: "john.smith@testi.com",
        phone: "222-2258989"
    },
    {
        id: s++,
        classID: "DIN17",
        name: {
            firstName: "Johan",
            lastName: "Smed"
        },
        address: {
            street: "Provgatan 1",
            zip: "098620439"
        },
        email: "johan.smed@testi2.com",
        phone: "222-2258989"
    },
    {
        id: s++,
        classID: "DIN18",
        name: {
            firstName: "Johann",
            lastName: "Schmidt"
        },
        address: {
            street: "Examenstrasse 1",
            zip: "4592198"
        },
        email: "johann.schmidt@experiment3.com",
        phone: "333-2258989"
    }
];

let c = 1;

let courses = [
    {
        id: c++,
        name: "Test course name1",
        description: "Test description1"
    },
    {
        id: c++,
        name: "Test course name 2",
        description: "Test description 2"
    },
    {
        id: c++,
        name: "Test course name 3",
        description: "Test description 3"
    }
];

let g = 1;

let grades = [
    {
        id: g++,
        studentID: 1,
        courseID: 2,
        grade: "4",
    },
    {
        id: g++,
        studentID: 2,
        courseID: 3,
        grade: "5",
    },
    {
        id: g++,
        studentID: 2,
        courseID: 3,
        grade: "6",
    }
];


const schema = gql`
    type Student {
        id: ID!,
        name: Name,
        classID: String,
        address: Address,
        email: String,
        phone: String
    }
    type Course {
        id: ID!,
        name: String,
        description: String
    }
    type Grade {
        id: ID!,
        studentID: ID,
        courseID: ID,
        grade: String
    }
    type Name {
        firstName: String,
        lastName: String
    }
    type Address {
        street: String,
        zip: String
    }

    type Mutation {
        createStudent (
            classID: String,
            name: iName,
            address: iAddress,
            email: String,
            phone: String
        ) : ItemCreatedResponse!

        createCourse (
            name: String,
            description: String
        ) : ItemCreatedResponse!

        createGrade (
            studentID: ID,
            courseID: ID,
            grade: String
        ) : ItemCreatedResponse!

        updateStudent (
            id: ID!,
            classID: String,
            name: iName,
            address: iAddress,
            email: String,
            phone: String
        ) : ItemCreatedResponse!

        updateCourse (
            id: ID!,
            name: String,
            description: String
        ) : ItemCreatedResponse!

        updateGrade (
            id: ID!,
            studentID: ID,
            courseID: ID,
            grade: String
        ) : ItemCreatedResponse!
    }
    
    input iName {
        firstName: String,
        lastName: String
    }
    
    input iAddress {
        street: String,
        zip: String
    }

    type ItemCreatedResponse {
        success: Boolean!
    }

    type Query {
        student(id: ID!): Student,
        students: [Student!]!,
        course(id: ID!): Course,
        courses: [Course!]!,
        grade(id: ID!): Grade,
        grades: [Grade!]!, 
        gradesByStudent(studentID: ID!): [Grade!]!, 
        gradesByCourse(courseID: ID!): [Grade!]!
    }
`;



const resolvers = {
    Query: {
        student: (parent, args, context, info) => {
            console.log("Query resolver, args", args);
            return students.find(s => s.id === +args.id);
        },
        students: (parents, args, context, info) => {
            return students;
        },
        course: (parent, args, context, info) => {
            return courses.find(c => c.id === +args.id)
        },
        courses: (parents, args, context, info) => {
            return courses;
        },
        grade: (parents, args, context, info) => {
            return grades.find(g => g.id === +args.id);
        },
        grades: (parent, args, context, info) => {
            return grades;
        },
        gradesByStudent: (parent, args, context, info) => {
            if (args.studentID) {
                return grades.filter(g => g.studentID === +args.studentID);
            }
            //return {found: false};
        },
        gradesByCourse: (parent, args, context, info) => {
            if (args.courseID) {
                return grades.filter(g => g.courseID === +args.courseID);
            }
            //return "NOT FOUND";
        }
    },//Queries

    Mutation: {
        createStudent: (parent, args, context, info) => {
            const student = {
                id: ((students.length) + 1).toString(),
                name: {
                    firstName: args.firstName,
                    lastName: args.lastName
                },
                address: {
                    street: args.street,
                    zip: args.zip
                },
                email: args.email,
                phone: args.phone
            };
            students.push(student);
            return {success: true};
        },
        createCourse: (parent, args, context, info) => {
            const course = {
                id: ((courses.length) + 1).toString(),
                name: args.name,
                description: args.description,
            };
            courses.push(course);
            return {success: true};
        },
        createGrade: (parent, args, context, info) => {
            const grade = {
                id: ((grades.length) + 1),
                studentID: args.studentID,
                courseID: args.courseID,
                grade: args.grade
            };
            grades.push(grade);
            return {success: true}
        },
        updateStudent: (parent, args, context, info) => {
            if (args.id) {
                const student = students.find(s => s.id === +args.id);
                if (student) {
                    if (args.name) {
                        student.name.firstName = args.name.firstName ? args.name.firstName : student.name.firstName
                        student.name.lastName = args.name.lastName ? args.name.lastName : student.name.lastName;
                    }
                    if (args.address) {
                        student.address.street = args.address.street ? args.address.street : student.address.street;
                        student.address.zip = args.address.zip ? args.address.zip : student.address.zip;
                    }
                    student.email = args.email ? args.email : student.email;
                    student.phone = args.phone ? args.phone : student.phone;
                    return {success: true};
                }
            }
            return {success: false};
        },
        updateCourse: (parent, args, context, info) => {
            if (args.id) {
                const course = courses.find(f => f.id === +args.id);
                if (course) {
                    course.name = args.name ? args.name : course.name;
                    course.description = args.description ? args.description : course.description;
                    return {success: true};
                }
            }
            return {success: false}
        },
        updateGrade: (parent, args, context, info) => {
            if (args.id) {
                const grade = grades.find(g => g.id === +args.id);
                if (grade) {
                    grade.studentID = args.studentID ? args.studentID : grade.studentID;
                    grade.courseID = args.courseID ? args.courseID : grade.courseID;
                    grade.grade = args.grade ? args.grade : grade.grade;
                    return {success: true}
                }
            }
            return {success: false}
        }
    }//Mutations
};

const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    formatError: error => {
        console.log(error);
        return error;
    },
    formatResponse: response => {
        console.log(response);
        return response;
    },
});

server.applyMiddleware({app, path: '/graphql'});

app.listen({port: 8000}, () => {
    console.log('Apollo Server on http://localhost:8000/graphql');
});
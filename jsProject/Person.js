export class Person
{
    constructor(name, age)
    {
        this.name =name;
        this.age = age;
    }

    introduce()
    {
        console.log(`hello I'm ${this.name} and my age is ${this.age}`);
    }
}
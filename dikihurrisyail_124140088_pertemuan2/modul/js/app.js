// JavaScript Next Gen Demo Code
// Script klasik (tanpa import/export) agar bisa dibuka via file://.
// Memakai data dari js/modules/data.js dan fungsi dari js/modules/utils.js.

// ----------------------------
// Let dan Const
// ----------------------------
function demoVariables() {
    // Menggunakan var (cara lama)
    var oldVar = "Old variable";
    {
        var oldVar = "Changed inside block";
    }

    // Menggunakan let (ES6)
    let newLet = "New let variable";
    {
        let newLet = "Different variable inside block";
        console.log("newLet inside block:", newLet);
    }

    // Menggunakan const (ES6)
    const PI = 3.14159;
    const user = { name: "John", age: 30 };
    user.age = 31; // Ini valid! Konten objek const dapat diubah

    return { oldVar, newLet, PI, user };
}

// ----------------------------
// Arrow Functions
// ----------------------------
function demoArrowFunctions() {
    function regularSum(a, b) {
        return a + b;
    }
    const arrowSum = (a, b) => {
        return a + b;
    };
    const shortArrowSum = (a, b) => a + b;
    const sayHello = () => "Hello World!";
    const square = x => x * x;

    return {
        regularSum: regularSum(5, 3),
        arrowSum: arrowSum(5, 3),
        shortArrowSum: shortArrowSum(5, 3),
        sayHello: sayHello(),
        square: square(4)
    };
}

// ----------------------------
// Template Literals
// ----------------------------
function demoTemplateLiterals() {
    const name = "John";
    const age = 30;
    const oldWay = "Nama saya " + name + " dan umur saya " + age + " tahun.";
    const newWay = `Nama saya ${name} dan umur saya ${age} tahun.`;
    const multiLine = `
        Ini adalah string multi-baris.
        Sangat berguna untuk HTML template.
        Nama: ${name}
        Umur: ${age}
    `;
    const expression = `Tahun lahir: ${new Date().getFullYear() - age}`;

    return { oldWay, newWay, multiLine, expression };
}

// ----------------------------
// Destructuring
// ----------------------------
function demoDestructuring() {
    const person = {
        firstName: "John",
        lastName: "Doe",
        age: 30,
        email: "john@example.com",
        address: {
            city: "Jakarta",
            postalCode: "12345"
        }
    };

    const { firstName, lastName } = person;
    const { firstName: fName, lastName: lName } = person;
    const { hobby = "coding" } = person;
    const { address: { city, postalCode } } = person;

    const colors = ["red", "green", "blue", "yellow", "purple"];
    const [firstColor, secondColor] = colors;
    const [, , thirdColor] = colors;
    const [primary, secondary, ...restColors] = colors;

    let a = 1;
    let b = 2;
    [a, b] = [b, a];

    return {
        objectBasic: { firstName, lastName },
        objectRenamed: { fName, lName },
        objectDefault: hobby,
        objectNested: { city, postalCode },
        arrayBasic: { firstColor, secondColor },
        arraySkipped: thirdColor,
        arrayRest: { primary, secondary, restColors },
        swapped: { a, b }
    };
}

// ----------------------------
// Spread dan Rest Operators
// ----------------------------
function demoSpreadRest() {
    const numbers = [1, 2, 3];
    const moreNumbers = [...numbers, 4, 5];
    const numbersCopy = [...numbers];

    const array1 = [1, 2, 3];
    const array2 = [4, 5, 6];
    const mergedArray = [...array1, ...array2];

    const person = { name: "John", age: 30 };
    const personCopy = { ...person };
    const extendedPerson = {
        ...person,
        email: "john@example.com",
        age: 31
    };

    function sum(...numbers) {
        return numbers.reduce((total, num) => total + num, 0);
    }

    function process(first, second, ...rest) {
        return { first, second, rest };
    }

    return {
        spreadArray: moreNumbers,
        copyArray: numbersCopy,
        mergedArrays: mergedArray,
        spreadObject: extendedPerson,
        restSum: sum(1, 2, 3, 4, 5),
        restProcess: process("a", "b", "c", "d", "e")
    };
}

// ----------------------------
// Default Parameters
// ----------------------------
function demoDefaultParams() {
    function greetOld(name, greeting) {
        name = name || "Guest";
        greeting = greeting || "Hello";
        return `${greeting}, ${name}!`;
    }

    function greet(name = "Guest", greeting = "Hello") {
        return `${greeting}, ${name}!`;
    }

    function createUser(name, role = "user", createdAt = new Date().toISOString()) {
        return { name, role, createdAt };
    }

    function createOrder(product, quantity = 1, price, total = price * quantity) {
        return { product, quantity, price, total };
    }

    return {
        oldWay: greetOld(),
        oldWayParams: greetOld("John", "Hi"),
        newWay: greet(),
        newWayParams: greet("John", "Hi"),
        withExpression: createUser("Alice"),
        usingPrevious: createOrder("Laptop", 2, 1000000)
    };
}

// ----------------------------
// Classes
// ----------------------------
function demoClasses() {
    class User {
        constructor(name, email) {
            this.name = name;
            this.email = email;
            this.createdAt = new Date();
        }
        getInfo() {
            return `${this.name} (${this.email})`;
        }
        getCreatedDate() {
            return this.createdAt.toLocaleDateString();
        }
    }

    class Admin extends User {
        constructor(name, email, role = "admin") {
            super(name, email);
            this.role = role;
        }
        getInfo() {
            return `${this.name} (${this.email}) - ${this.role}`;
        }
        hasAccess(module) {
            return true;
        }
    }

    const user = new User("John Doe", "john@example.com");
    const admin = new Admin("Admin User", "admin@example.com");

    return {
        user: {
            info: user.getInfo(),
            createdDate: user.getCreatedDate()
        },
        admin: {
            info: admin.getInfo(),
            createdDate: admin.getCreatedDate(),
            hasAccess: admin.hasAccess("dashboard")
        },
        isUserInstance: user instanceof User,
        isAdminInstance: admin instanceof User
    };
}

// ----------------------------
// Enhanced Object Literals
// ----------------------------
function demoObjectLiterals() {
    const name = "John";
    const age = 30;

    const oldPerson = {
        name: name,
        age: age,
        sayHello: function() {
            return "Hello!";
        }
    };

    const newPerson = {
        name,
        age,
        sayHello() {
            return "Hello!";
        },
        ["skill_" + 1]: "JavaScript",
        ["skill_" + 2]: "React"
    };

    const prefix = "user";
    const userData = {
        [`${prefix}_id`]: 123,
        [`${prefix}_name`]: "john_doe",
        [Date.now()]: "timestamp"
    };

    return {
        oldWay: oldPerson,
        newWay: newPerson,
        methods: {
            old: oldPerson.sayHello(),
            new: newPerson.sayHello()
        },
        computedProps: {
            skill1: newPerson.skill_1,
            skill2: newPerson.skill_2
        },
        dynamicProps: userData
    };
}

// ----------------------------
// Modern Array Methods dan Higher-Order Functions
// ----------------------------
function demoArrayMethods() {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const users = [
        { id: 1, name: "John", age: 25, active: true },
        { id: 2, name: "Jane", age: 30, active: false },
        { id: 3, name: "Bob", age: 22, active: true },
        { id: 4, name: "Alice", age: 28, active: true },
        { id: 5, name: "Charlie", age: 35, active: false }
    ];

    const doubled = numbers.map(num => num * 2);
    const evenNumbers = numbers.filter(num => num % 2 === 0);
    const activeUsers = users.filter(user => user.active);
    const userJane = users.find(user => user.name === "Jane");
    const hasAdult = users.some(user => user.age >= 18);
    const allAdults = users.every(user => user.age >= 18);
    const sum = numbers.reduce((total, num) => total + num, 0);
    const oldest = users.reduce((oldest, user) =>
        user.age > oldest.age ? user : oldest, users[0]);

    const activeUsersNames = users
        .filter(user => user.active)
        .map(user => user.name);

    const totalActiveAge = users
        .filter(user => user.active)
        .reduce((sum, user) => sum + user.age, 0);

    return {
        map: doubled,
        filter: {
            evenNumbers,
            activeUsers: activeUsers.length
        },
        find: userJane,
        some: hasAdult,
        every: allAdults,
        reduce: {
            sum,
            oldest: oldest.name
        },
        chaining: {
            activeUsersNames,
            totalActiveAge
        }
    };
}

// ----------------------------
// Array Lanjutan
// ----------------------------
function demoAdvancedArrays() {
    const numbers = [1, 2, 3, 4, 5];

    const numbersCopy = [...numbers];
    const moreNumbers = [...numbers, 6, 7, 8];
    const combinedArrays = [...numbers, ...[6, 7, 8, 9]];

    const fromIterable = Array.from("hello");
    const withMapFn = Array.from(numbers, n => n * n);

    const newArray = Array.of(1, "two", { three: 3 });

    const nestedArrays = [1, [2, 3], [[4, 5], 6]];
    const flattened = nestedArrays.flat();
    const deepFlattened = nestedArrays.flat(2);

    const flatMapped = numbers.flatMap(n => [n, n * 2]);

    const hasThree = numbers.includes(3);

    return {
        clone: numbersCopy,
        concat: { moreNumbers, combinedArrays },
        arrayFrom: { fromIterable, withMapFn },
        arrayOf: newArray,
        flatAndFlatMap: { flattened, deepFlattened, flatMapped },
        includes: hasThree
    };
}

// ----------------------------
// Modules (data.js + utils.js)
// ----------------------------
function demoModules() {
    const users = typeof sampleUsers !== "undefined" ? sampleUsers : [];
    const products = typeof sampleProducts !== "undefined" ? sampleProducts : [];
    const activeAdmins = users.filter(u => u.active && u.role === "admin").map(u => u.name);
    const prices = products.map(p => {
        const fmt = typeof formatRupiah !== "undefined" ? formatRupiah(p.price) : p.price;
        return `${p.name}: ${fmt}`;
    });
    const cap = typeof capitalize !== "undefined" ? capitalize("modul berjalan") : "modul berjalan";
    return { activeAdmins, prices, cap, userCount: users.length, productCount: products.length };
}

// ----------------------------
// Promises (diperbaiki: tidak pakai getElementById sebelum elemen ada)
// ----------------------------
function demoPromises() {
    function fetchData(id) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (id > 0) {
                    resolve({ id, name: `User ${id}`, success: true });
                } else {
                    reject(new Error("ID tidak valid"));
                }
            }, 1000);
        });
    }

    // Buat elemen dulu, simpan referensi span-nya, baru jalankan promise.
    const outputDiv = document.createElement('div');
    outputDiv.className = 'promise-outputs';

    function createRow(label) {
        const row = document.createElement('div');
        row.className = 'promise-result';
        const strong = document.createElement('strong');
        strong.textContent = label + ': ';
        const span = document.createElement('span');
        span.textContent = 'Memuat...';
        row.appendChild(strong);
        row.appendChild(span);
        outputDiv.appendChild(row);
        return span;
    }

    const basicSpan = createRow('Promise Dasar');
    const chainSpan = createRow('Promise Chain');
    const allSpan = createRow('Promise.all');
    const raceSpan = createRow('Promise.race');

    fetchData(1)
        .then(data => { basicSpan.textContent = `Sukses: ${JSON.stringify(data)}`; })
        .catch(err => { basicSpan.textContent = `Error: ${err.message}`; });

    fetchData(2)
        .then(user => {
            chainSpan.textContent = `Dapat user: ${user.name}`;
            return fetchData(3);
        })
        .then(secondUser => { chainSpan.textContent += ` dan ${secondUser.name}`; })
        .catch(err => { chainSpan.textContent = `Error: ${err.message}`; });

    Promise.all([fetchData(4), fetchData(5), fetchData(6)])
        .then(results => { allSpan.textContent = `Semua selesai: ${results.map(r => r.name).join(', ')}`; })
        .catch(err => { allSpan.textContent = `Error di salah satu: ${err.message}`; });

    Promise.race([
        fetchData(7),
        fetchData(8),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Timeout")), 1500))
    ])
        .then(winner => { raceSpan.textContent = `Pemenang race: ${winner.name}`; })
        .catch(err => { raceSpan.textContent = `Error race: ${err.message}`; });

    return outputDiv;
}

// ----------------------------
// Async/Await
// ----------------------------
function demoAsyncAwait() {
    function fetchUser(id) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (id > 0) {
                    resolve({
                        id,
                        name: `User ${id}`,
                        email: `user${id}@example.com`
                    });
                } else {
                    reject(new Error("ID user tidak valid"));
                }
            }, 1000);
        });
    }

    function fetchUserPosts(userId) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    { id: 1, title: "Post 1", body: "Konten untuk post 1" },
                    { id: 2, title: "Post 2", body: "Konten untuk post 2" },
                ]);
            }, 800);
        });
    }

    async function getUserData(id) {
        try {
            const user = await fetchUser(id);
            const posts = await fetchUserPosts(user.id);
            return { user, posts, success: true };
        } catch (error) {
            return { error: error.message, success: false };
        }
    }

    async function getMultipleUsers(ids) {
        try {
            const userPromises = ids.map(id => fetchUser(id));
            const users = await Promise.all(userPromises);
            const postPromises = users.map(user => fetchUserPosts(user.id));
            const allPosts = await Promise.all(postPromises);
            return users.map((user, i) => ({
                user,
                posts: allPosts[i]
            }));
        } catch (error) {
            return { error: error.message };
        }
    }

    const outputDiv = document.createElement('div');
    outputDiv.className = 'async-outputs';

    const basicAsyncResult = document.createElement('div');
    basicAsyncResult.innerHTML = '<strong>User Tunggal:</strong> Memuat...';
    basicAsyncResult.className = 'async-result';
    outputDiv.appendChild(basicAsyncResult);

    const parallelAsyncResult = document.createElement('div');
    parallelAsyncResult.innerHTML = '<strong>Beberapa User:</strong> Memuat...';
    parallelAsyncResult.className = 'async-result';
    outputDiv.appendChild(parallelAsyncResult);

    getUserData(42).then(result => {
        if (result.success) {
            basicAsyncResult.innerHTML =
                `<strong>User Tunggal:</strong> ${result.user.name} | Posts: ${result.posts.length}`;
        } else {
            basicAsyncResult.innerHTML = `<strong>Error:</strong> ${result.error}`;
        }
    });

    getMultipleUsers([101, 102, 103]).then(results => {
        if (!results.error) {
            parallelAsyncResult.innerHTML =
                `<strong>Beberapa User:</strong> ${results.map(r => r.user.name).join(', ')} | ` +
                `Total posts: ${results.reduce((sum, r) => sum + r.posts.length, 0)}`;
        } else {
            parallelAsyncResult.innerHTML = `<strong>Error:</strong> ${results.error}`;
        }
    });

    return outputDiv;
}

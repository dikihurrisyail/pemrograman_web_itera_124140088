// js/main.js — DOM Controller, versi klasik (tanpa import/export).
// Dibungkus DOMContentLoaded agar getElementById tidak null.

document.addEventListener("DOMContentLoaded", () => {
    const outputEl = document.getElementById("output");
    const runBtn = document.getElementById("runBtn");
    const clearBtn = document.getElementById("clearBtn");

    if (!outputEl) {
        console.error("main.js: #output tidak ditemukan");
        return;
    }
    if (!runBtn) {
        console.error("main.js: #runBtn tidak ditemukan");
        return;
    }

    // Helper: render kartu hasil, kembalikan elemen <pre class="result">
    // agar demo async bisa appendChild dengan aman.
    function addOutput(title, subtitle, content) {
        const card = document.createElement("div");
        card.className = "output-item";
        const h = document.createElement("h4");
        h.textContent = title;
        const p = document.createElement("p");
        p.className = "subtitle";
        p.textContent = subtitle;
        const pre = document.createElement("pre");
        pre.className = "result";
        pre.textContent = content;
        card.appendChild(h);
        card.appendChild(p);
        card.appendChild(pre);
        outputEl.appendChild(card);
        return pre;
    }

    function runAllDemos() {
        outputEl.innerHTML = "";
        console.log("runAllDemos() jalan...");

        try {
            const varResults = demoVariables();
            addOutput(
                "1. Let dan Const",
                "var vs let/const dan block scope",
                `var (function scope): ${varResults.oldVar}\nlet (block scope): ${varResults.newLet}\nconst (immutable): ${varResults.PI}\nconst object (mutable content): ${JSON.stringify(varResults.user)}`
            );

            const arrowResults = demoArrowFunctions();
            addOutput(
                "2. Arrow Functions",
                "Perbandingan fungsi reguler dan arrow functions",
                `Regular function: ${arrowResults.regularSum}\nArrow function: ${arrowResults.arrowSum}\nShort arrow: ${arrowResults.shortArrowSum}\nNo params: ${arrowResults.sayHello}\nSingle param: ${arrowResults.square}`
            );

            const templateResults = demoTemplateLiterals();
            addOutput(
                "3. Template Literals",
                "String concatenation vs template literals",
                `Old way: ${templateResults.oldWay}\nNew way: ${templateResults.newWay}\nWith expression: ${templateResults.expression}\nMulti-line: ${templateResults.multiLine}`
            );

            const destructuringResults = demoDestructuring();
            addOutput(
                "4. Destructuring",
                "Ekstraksi nilai dari objek dan array",
                `Object basic: ${JSON.stringify(destructuringResults.objectBasic)}\nObject renamed: ${JSON.stringify(destructuringResults.objectRenamed)}\nObject default: ${destructuringResults.objectDefault}\nObject nested: ${JSON.stringify(destructuringResults.objectNested)}\nArray basic: ${JSON.stringify(destructuringResults.arrayBasic)}\nArray skipped: ${destructuringResults.arraySkipped}\nArray with rest: ${JSON.stringify(destructuringResults.arrayRest)}\nSwapped variables: ${JSON.stringify(destructuringResults.swapped)}`
            );

            const spreadRestResults = demoSpreadRest();
            addOutput(
                "5. Spread dan Rest Operators",
                "Penggunaan ... untuk array dan objek",
                `Spread in array: ${JSON.stringify(spreadRestResults.spreadArray)}\nCopy array: ${JSON.stringify(spreadRestResults.copyArray)}\nMerged arrays: ${JSON.stringify(spreadRestResults.mergedArrays)}\nSpread in object: ${JSON.stringify(spreadRestResults.spreadObject)}\nRest in function (sum): ${spreadRestResults.restSum}\nRest with regular params: ${JSON.stringify(spreadRestResults.restProcess)}`
            );

            const defaultParamsResults = demoDefaultParams();
            addOutput(
                "6. Default Parameters",
                "Nilai default untuk parameter fungsi",
                `Old way: ${defaultParamsResults.oldWay}\nOld way with params: ${defaultParamsResults.oldWayParams}\nNew way: ${defaultParamsResults.newWay}\nNew way with params: ${defaultParamsResults.newWayParams}\nWith expression: ${JSON.stringify(defaultParamsResults.withExpression)}\nUsing previous params: ${JSON.stringify(defaultParamsResults.usingPrevious)}`
            );

            const classesResults = demoClasses();
            addOutput(
                "7. Classes",
                "Penggunaan class dan inheritance",
                `User: ${classesResults.user.info}\nUser created: ${classesResults.user.createdDate}\nAdmin: ${classesResults.admin.info}\nAdmin created: ${classesResults.admin.createdDate}\nAdmin has access: ${classesResults.admin.hasAccess}\nuser instanceof User: ${classesResults.isUserInstance}\nadmin instanceof User: ${classesResults.isAdminInstance}`
            );

            const objectLiteralsResults = demoObjectLiterals();
            addOutput(
                "8. Enhanced Object Literals",
                "Penulisan objek yang lebih ringkas",
                `Property shorthand: ${JSON.stringify(objectLiteralsResults.newWay)}\nMethod shorthand: ${objectLiteralsResults.methods.new}\nComputed properties: ${JSON.stringify(objectLiteralsResults.computedProps)}\nDynamic properties: ${JSON.stringify(objectLiteralsResults.dynamicProps)}`
            );

            const arrayMethodsResults = demoArrayMethods();
            addOutput(
                "9. Modern Array Methods",
                "Higher-Order Functions pada array",
                `map: ${JSON.stringify(arrayMethodsResults.map)}\nfilter (evenNumbers): ${JSON.stringify(arrayMethodsResults.filter.evenNumbers)}\nfilter (activeUsers): ${arrayMethodsResults.filter.activeUsers}\nfind: ${JSON.stringify(arrayMethodsResults.find)}\nsome (hasAdult): ${arrayMethodsResults.some}\nevery (allAdults): ${arrayMethodsResults.every}\nreduce (sum): ${arrayMethodsResults.reduce.sum}\nreduce (oldest): ${arrayMethodsResults.reduce.oldest}\nchaining (activeUsersNames): ${JSON.stringify(arrayMethodsResults.chaining.activeUsersNames)}\nchaining (totalActiveAge): ${arrayMethodsResults.chaining.totalActiveAge}`
            );

            const advArraysResults = demoAdvancedArrays();
            addOutput(
                "10. Advanced Arrays",
                "Fitur array lanjutan",
                `Clone: ${JSON.stringify(advArraysResults.clone)}\nConcat: ${JSON.stringify(advArraysResults.concat.combinedArrays)}\nArray.from: ${JSON.stringify(advArraysResults.arrayFrom.withMapFn)}\nArray.of: ${JSON.stringify(advArraysResults.arrayOf)}\nflat: ${JSON.stringify(advArraysResults.flatAndFlatMap.flattened)}\ndeepFlat: ${JSON.stringify(advArraysResults.flatAndFlatMap.deepFlattened)}\nflatMap: ${JSON.stringify(advArraysResults.flatAndFlatMap.flatMapped)}\nincludes: ${advArraysResults.includes}`
            );

            // Demo modul data + utils (bukti folder js/modules dipakai)
            const modResults = demoModules();
            addOutput(
                "11. Modules (data.js + utils.js)",
                "Pemakaian file modul terpisah tanpa bundler",
                `Active admins: ${JSON.stringify(modResults.activeAdmins)}\nPrices: ${JSON.stringify(modResults.prices)}\nCapitalize: ${modResults.cap}\nUsers: ${modResults.userCount}, Products: ${modResults.productCount}`
            );

            // Demo Promises — append ke <pre> yang baru dibuat
            const promisePre = addOutput(
                "12. Promises",
                "Penanganan operasi asinkron dengan Promise",
                "Memuat..."
            );
            promisePre.textContent = "";
            promisePre.appendChild(demoPromises());

            // Demo Async/Await
            const asyncPre = addOutput(
                "13. Async/Await",
                "Penanganan operasi asinkron dengan syntax yang lebih bersih",
                "Memuat..."
            );
            asyncPre.textContent = "";
            asyncPre.appendChild(demoAsyncAwait());
        } catch (err) {
            console.error("Gagal jalan:", err);
            addOutput("Error", "Terjadi error saat demo", String(err && err.stack || err));
        }
    }

    runBtn.addEventListener("click", runAllDemos);

    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            outputEl.innerHTML = "";
        });
    }

    console.log("main.js siap: tombol Run Demo aktif");
});

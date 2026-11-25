import { loadTasks, saveTasks } from "./storage.js";

const [command, ...args] = process.argv.slice(2);

function fail(message) {
    console.error(message);
    process.exit(1);
}

const COMMANDS = ["dodaj", "popis", "gotovo"];
if (!COMMANDS.includes(command)) {
    fail("Nepoznata naredba. Koristi: dodaj, popis ili gotovo.");
}

try {
    const tasks = await loadTasks();

    switch (command) {
        case "dodaj": {
            const title = args.join(" ").trim();
            if (title === "") {
                fail('Nedostaje naslov. Korištenje: npm start -- dodaj "naslov zadatka"');
            }

            const newId =
                tasks.length === 0
                    ? 1
                    : Math.max(...tasks.map((task) => task.id)) + 1;
            tasks.push({ id: newId, naslov: title, gotovo: false });
            await saveTasks(tasks);
            console.log(`Dodano: ${title} (broj ${newId})`);
            break;
        }

        case "popis":
            if (tasks.length === 0) {
                console.log("Nema zadataka.");
            } else {
                for (const task of tasks) {
                    console.log(`${task.id}. [${task.gotovo ? "x" : " "}] ${task.naslov}`);
                }
            }
            break;

        case "gotovo": {
            const raw = args[0];
            const id = Number(raw);
            if (raw === undefined || raw.trim() === "" || !Number.isInteger(id)) {
                fail("Broj zadatka mora biti cijeli broj. Korištenje: npm start -- gotovo broj");
            }

            const task = tasks.find((item) => item.id === id);
            if (task === undefined) {
                fail(`Zadatak broj ${id} ne postoji.`);
            }

            task.gotovo = true;
            await saveTasks(tasks);
            console.log(`Zadatak broj ${id} označen je kao gotov.`);
            break;
        }
    }
} catch (error) {
    fail(`Pogreška: ${error.message}`);
}

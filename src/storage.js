import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const FILE = join(process.cwd(), "zadaci.json");

function isValidTask(task) {
    return (
        task !== null &&
        typeof task === "object" &&
        Number.isInteger(task.id) &&
        typeof task.naslov === "string" &&
        typeof task.gotovo === "boolean"
    );
}

// Učitava zadatke; ako datoteka ne postoji, vraća prazan popis.
export async function loadTasks() {
    let text;
    try {
        text = await readFile(FILE, "utf-8");
    } catch (error) {
        if (error.code === "ENOENT") {
            return [];
        }
        throw new Error(`Datoteku zadaci.json nije moguće pročitati (${error.message}).`);
    }

    let tasks;
    try {
        tasks = JSON.parse(text);
    } catch {
        throw new Error(
            "Datoteka zadaci.json nije ispravan JSON. Popravi je ili je obriši.",
        );
    }

    if (!Array.isArray(tasks) || !tasks.every(isValidTask)) {
        throw new Error(
            "Datoteka zadaci.json mora sadržavati polje zadataka s svojstvima id, naslov i gotovo.",
        );
    }

    return tasks;
}

// Sprema zadatke u zadaci.json.
export async function saveTasks(tasks) {
    try {
        await writeFile(FILE, JSON.stringify(tasks, null, 2), "utf-8");
    } catch (error) {
        throw new Error(`Spremanje u zadaci.json nije uspjelo (${error.message}).`);
    }
}

const cases = [
    "What is inertia?",
    "What is inertia ?",
    "what is inertia ?",
    "what is inertia??",
    "what is inertia!!!"
];

console.log("Normalizing...");
cases.forEach(q => {
    const normalizedQuestion = q
        .toLowerCase()
        .trim()
        .replace(/\s+/g, " ")               // collapse multiple spaces
        .replace(/\s([?.!,])/g, "$1")       // remove space before punctuation
        .replace(/([?.!,])+/g, "$1");       // collapse repeated punctuation
    console.log(`"${q}" => "${normalizedQuestion}"`);
});

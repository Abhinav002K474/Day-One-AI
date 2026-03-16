const cases = [
    "What is the definition of inertia?",
    "what is the meaning of inertia?",
    "what is inertia in physics?",
    "explain inertia in Newton's first law",
    "describe inertia with example",
    "what is inertia and momentum?",
    "What is the definition of inertia"
];

console.log("Normalizing...");
cases.forEach(q => {
    let normalizedQuestion = q
        .toLowerCase()
        .trim()
        .replace(/\s+/g, " ")
        .replace(/\s([?.!,])/g, "$1")
        .replace(/([?.!,])+/g, "$1")
        .replace(/[!?]+$/, "?")
        .replace(/^(what is the definition of |what is the meaning of )/g, "")
        .replace(/^(what is a |what is an |what is |what are |define a |define an |define |explain a |explain an |explain |describe a |describe an |describe |tell me about a |tell me about an |tell me about )/g, "")
        .replace(/\s+(meaning|definition)\??$/g, "")
        .replace(/\?$/, "");
    console.log(`"${q}" => "${normalizedQuestion}"`);
});

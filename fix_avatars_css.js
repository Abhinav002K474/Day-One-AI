const fs = require('fs');

const cssToAdd = `
/* --- Fix Profile Modal Avatars --- */
.avatar-item {
    text-align: center;
    cursor: pointer;
    transition: transform 0.2s ease;
}
.avatar-item img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 50%;
    border: 2px solid transparent;
    transition: border-color 0.2s ease;
    margin-bottom: 8px;
    display: block;
    margin-left: auto;
    margin-right: auto;
}
.avatar-item:hover {
    transform: scale(1.05);
}
.avatar-item:hover img {
    border-color: #3b82f6;
}
.avatar-item span {
    font-size: 0.85rem;
    color: #9ca3af;
    display: block;
}
`;

fs.appendFileSync('styles.css', cssToAdd);
console.log("CSS added successfully!");

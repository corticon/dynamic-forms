// controls/getNextUniqueId.js
let nextUniqueInputId = 0;

export function getNextUniqueId() {
    return "_" + (++nextUniqueInputId);
}
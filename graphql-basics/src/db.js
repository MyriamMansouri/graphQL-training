const comments = [{
    id: 'a',
    text: "Cool",
    author: 'abc123',
    post: 'qwerty123',
},{
    id: 'b',
    text: "Not Nice",
    author: 'abc123',
    post: 'qwerty457',
},{
    id: 'c',
    text: "Imo",
    author: '1',
    post: 'qwerty456',
},{
    id: 'd',
    text: "OMG !!!!!!!!!!!!!",
    author: 'abc456',
    post: 'qwerty123',
}]

const posts = [{
    id: 'qwerty123',
    title: "Poker Faceee",
    body: "Popopopoker face, Popopoker face",
    author: 'abc123',
    published: true,
},{
    id: 'qwerty456',
    title: "Telephone",
    author: 'abc123',
    body: "Hello Hello Baby, You Call, I Can't Ear a Thing",
    published: false
},{
    id: 'qwerty457',
    title: "La Tribu de Dana",
    author: 'abc456',
    body: "Je suis devenu roi, de la tribu de Dana, Dana, Dana, Dana",
    published: false
}]

const users = [{
    id: '1',
    name: 'Riri',
    email: 'riri@gaga.com',
    age: 12,
}, {
    id: 'abc123',
    name: 'Lady Gaga',
    email: 'lady@gaga.com',
    age: 33,
}, {
    id: 'abc456',
    name: 'Manau',
    email: 'manau@manau.com',
    age: 45,
}, {
    id: 'abc487',
    name: 'Kiki',
    email: 'kiki@gaga.com',
    age: 78,
}]

const db = {
    users,
    posts,
    comments
}

export { db as default }
const { Readable, Writable, Transform } = require('stream');

let counter = 0;

const input = new Readable({
  objectMode: true,
  read(size) {
    setInterval( () => {
      this.push({c: counter++});  
    }, 1000);  
  }  
});

const output = new Writable({
  write(chunk, encoding, callback) {
    console.log('writing chunk: ', chunk.toString());
    callback();  
  }  
});

const transform = new Transform({
  writableObjectMode: true,
  transform(chunk, encoding, callback) {
    this.push(JSON.stringify(chunk));
    callback();  
  }  
});

input.pipe(transform);
transform.pipe(output);
class Node {
  constructor(key, next = null) {
    this.key = key;
    this.next = next;
  }
}

class HashTable {
  constructor(size) {
    this.storage = new Array(size);
    this.size = size;
    this.dataLength = 0;
  }
  calculateHash(key) {
    return key.toString().length % this.size;
  }
  add(key) {
    const hash = this.calculateHash(key);
    if (!this.storage[hash]) {
      this.storage[hash] = new Node(key);
    } else {
      this.storage[hash] = new Node(key, this.storage[hash]);
    }
    this.dataLength++;
  }
  searchLinks(node, key) {
    if (node.key === key) {
      return node;
    } else {
      return this.searchLinks(node.next, key);
    }
  }
  search(key) {
    const hash = this.calculateHash(key);
    if (this.storage[hash].key === key) {
      return this.storage[hash];
    } else {
      return this.searchLinks(this.storage[hash].next, key);
    }
  }
  delete(key) {
    const hash = this.calculateHash(key);
    if (this.storage[hash].key === key) {
      if (this.storage[hash].next) {
        this.storage[hash] = this.storage[hash].next;
      } else {
        this.storage[hash] = null;
      }
    } else {
      let data = this.storage[hash];
      let node = this.searchLinks(data.next, key);
      while (data.next !== node) {
        data = data.next;
      }
      data.next = node.next;
    }
  }
  getLength() {
    return this.dataLength;
  }
}

const table = new HashTable(50);
table.add('ham');
table.add('5');
table.add('asasasasasasasasasas');
table.search('asasasasasasasasasas');
table.delete('asasasasasasasasasas');

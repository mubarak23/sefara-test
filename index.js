function createDirectory(root, path) {
  if (path.includes('/')) {
      const [parent, dirName] = path.split('/').reverse();
      if (!root[parent] || !root[parent].children) {
          return `Cannot create ${path} - ${parent} does not exist`;
      }
      if (root[parent].children[dirName]) {
          return `Cannot create ${path} - ${dirName} already exists`;
      }
      root[parent].children[dirName] = { children: {} };
  } else {
      if (root[path]) {
          return `Cannot create ${path} - ${path} already exists`;
      }
      root[path] = { children: {} };
  }
  return `${path} created`;
}

function moveDirectory(root, source, destination) {
  if (source === destination) {
      return `${source} moved to ${destination}`;
  }

  const [sourceParent, sourceDir] = source.split('/').reverse();
  if (!root[sourceParent] || !root[sourceParent].children) {
      return `Cannot move ${source} - ${sourceParent} does not exist`;
  }
  if (!root[sourceParent].children[sourceDir]) {
      return `Cannot move ${source} - ${sourceDir} does not exist`;
  }

  const [destParent, destDir] = destination.split('/').reverse();
  if (!root[destParent] || !root[destParent].children) {
      return `Cannot move ${source} - ${destParent} does not exist`;
  }
  if (root[destParent].children[destDir]) {
      return `Cannot move ${source} - ${destDir} already exists`;
  }

  root[destParent].children[destDir] = root[sourceParent].children[sourceDir];
  delete root[sourceParent].children[sourceDir];
  return `${source} moved to ${destination}`;
}

function deleteDirectory(root, path) {
  if (!root[path]) {
      return `Cannot delete ${path} - ${path} does not exist`;
  }
  delete root[path];
  return `${path} deleted`;
}

function listDirectories(root, indent = 0) {
  let result = '';
  for (const child in root) {
      result += '  '.repeat(indent) + child + '\n';
      if (root[child].children) {
          result += listDirectories(root[child].children, indent + 1);
      }
  }
  return result;
}

function processCommands(commands) {
  const root = {};
  const output = [];

  for (const command of commands) {
      const [action, ...args] = command.split(' ');
      let result;
      if (action === 'CREATE') {
          result = createDirectory(root, args[0]);
      } else if (action === 'MOVE') {
          result = moveDirectory(root, args[0], args[1]);
      } else if (action === 'DELETE') {
          result = deleteDirectory(root, args[0]);
      } else if (action === 'LIST') {
          result = listDirectories(root);
      }
      console.log("result:",result)
      if(result) output.push(result.trim());
  }

  return output;
}

const commands = [
  "CREATE fruits",
  "CREATE vegetables",
  "CREATE grains",
  "CREATE fruits/apples",
  "CREATE fruits/apples/fuji",
  "LIST",
  "CREATE grains/squash",
  "MOVE grains/squash vegetables",
  "CREATE foods",
  "MOVE grains foods",
  "MOVE fruits foods",
  "MOVE vegetables foods",
  "LIST",
  "DELETE fruits/apples",
  "DELETE foods/fruits/apples",
  "LIST"
];

const output = processCommands(commands);
output.forEach(line => console.log(line));

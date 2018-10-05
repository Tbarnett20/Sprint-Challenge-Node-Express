const express = require('express');
const server = express(); // Creates me server arrhh
const actionModel = require('./data/helpers/actionModel');
const projectModel = require('./data/helpers/projectModel');
const logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');


server.use(express.json());
server.use(logger('combined'));
server.use(cors());
server.use(helmet());

server.get('/', (req, res) => {
  res.send('Is this working?')
})

// #################### GET #######################

// ******************** GET All Projects **********************
server.get('/projects', (req, res) => {
  projectModel
    .get()
    .then((projects) => {
      res.json(projects);
    })
    .catch(() => {
      res.status(500).json({ Error: 'Internal Server Error' });
    });
});

// ******************** GET Single Project **********************
server.get('/projects/:id', (req, res) => {
  const { id } = req.params;
  projectModel
    .get(id)
    .then((project) => {
      if (project === 0) {
        res.status(404).json({ Message: 'Not Found Error' });
      } else {
        res.json(project);
      }
    })
    .catch(() => {
      res.status(500).json({ Error: 'Internal Server Error' });
    });
});

// ******************** GET List of All Actions For A Project **********************
server.get('/projects/:id/actions', (req, res) => {
  const { id } = req.params;
  projectModel
    .get(id)
    .then((project) => {
      if (project === 0) {
        res.status(404).json({ Message: 'Not Found Error' });
      } else {
        projectModel.getProjectActions(id).then((actions) => {
          res.status(201).json(actions);
        });
      }
    })
    .catch(() => {
      res.status(500).json({ Error: 'Internal Server Error' });
    });
});


// #################### POST #######################

// ******************** POST Add Project **********************
server.post('/projects', (req, res) => {
  const project = req.body;
  if (!project.name || !project.description) {
    res.status(404).json({ Error: 'Add a damn name and description. WTF!' });
  }
  projectModel
    .insert(project)
    .then((project) => {
      res.status(201).json(project);
    })
    .catch(() => {
      res
        .status(500)
        .json({ Error: `That shit ain't save and idk why!` });
    });
});


// #################### DELETE #######################

// ******************** DELETE Project **********************
server.delete('/projects/:id', (req, res) => {
  projectModel
    .remove(req.params.id)
    .then((project) => {
      if (project === 0) {
        res.status(404).json({ Message: 'You know damn well this project is gone and probably never was here to begin with!' });
      } else {
        res.status(200).json(project);
      }
    })
    .catch(() => {
      res.status(500).json({
        Error: `That shit not saving but you internet is working:)`
      });
    });
});


// #################### PUT #######################

// ******************** UPDATE Project Information **********************
server.put('/projects/:id', (req, res) => {
  const { id } = req.params;
  const project = req.body;
  if (!project.name || !project.description) {
    res.status(404).json({ Error: 'Add a damn name and description. WTF!' });
  }
  projectModel
    .update(id, project)
    .then((id) => {
      if (id === 0) {
        res.status(404).json({
          Message: `Shit doesn't exist, bruh.`
        });
      }
      res.status(200).json(id);
    })
    .catch(() => {
      res.status(500).json({ Error: `Not feeling to well.....didn't update project information` });
    });
});


// watch for traffic in a particular computer port
const port = 9000;
server.listen(port, () =>
  console.log(`\n=== API running on port power level over ${port}!!! ===\n`)
);
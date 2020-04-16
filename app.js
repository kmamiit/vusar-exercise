var _ = require('lodash');
var ps = require('current-processes');
const express = require('express');
const app = express();

app.use(express.json());

const projects = [
    {id: 1, name: 'project 1', timestamp: 'Jan 1 2015 08:53:00', userID: 1, objects: [
        {objectID: 1, objectName: 'object 1', length: 10, height: 20, width: 15},
        {objectID: 2, objectName: 'object 2', length: 20, height: 10, width: 25}
    ]},
    {id: 2, name: 'project 2', timestamp: 'Oct 1 2010 04:30:00', userID: 2, objects: [
        {objectID: 1, objectName: 'object 1', length: 20, height: 20, width: 35},
        {objectID: 2, objectName: 'object 2', length: 40, height: 25, width: 35},
        {objectID: 3, objectName: 'object 3', length: 10, height: 25, width: 15}
    ]},
]

// Create Project Information
app.post('/api/projects/', (req, res) => {
    if (!req.body.name || !req.body.userID) {
        if (!req.body.name){
            res.status(400).send("Name required");
        }
        if (!req.body.userID){
            res.status(400).send("User ID required");
        }        
        // res.status(400).send("Name and user ID are required");
        return;
    }

    const project = {
        id: projects.length + 1,
        name: req.body.name,
        timestamp: Date.now(),
        userID: req.body.userID,
        objects: req.body.objects
    };
    projects.push(project);
    res.send(project);
});

// Update Project Information
app.put('/api/projects/:id', (req,res) => {
    const project = projects.find(p => p.id === parseInt(req.params.id));
    if (!project) { //404
        return res.status(404).send('The project with the given ID was not found');
    }

    if (!req.body.name || !req.body.userID) {
        if (!req.body.name){ //400
            res.status(400).send("Name required");
        }
        if (!req.body.userID){
            res.status(400).send("User ID required");
        }        
        return;
    }

    project.name = req.body.name;
    res.send(project);
})

// Delete Project Information
app.delete('/api/projects/:id', (req, res) => {
    const project = projects.find(p => p.id === parseInt(req.params.id));
    if (!project) { 
        return res.status(404).send('The project with the given ID was not found');
    }    

    const index = projects.indexOf(project);
    projects.splice(index, 1);
    res.send(project);
})


// Test local network
app.get('/', (req, res) => {
    res.send('Hello World! Get Request Successful!');
});

// Get Project Information
app.get('/api/projects', (req, res) => {
    res.send(projects);
});

// Get Project Information based on ID
app.get('/api/projects/:id', (req, res) => {
    const project = projects.find(p => p.id === parseInt(req.params.id));
    if (!project) { //404
        return res.status(404).send('The project with the given ID was not found');
    }
    res.send(project);
});

// Get Project Information based on ID and name
app.get('/api/projects/:id/:name', (req, res) => {
    const project = projects.find(p => p.name === req.params.name);
    if (!project) { 
        res.status(404).send('The project with the given name was not found');
    }
    res.send(project);
});

// app.get('/api/projects/:id/:name/:timestamp/:userID/:objects', (req, res) => {
//     res.send(req);
// });


// Get List of running processes
app.get('/api/processes', (req, res) => {    

    ps.get(function(err, processes) {
        const sorted = _.sortBy(processes, 'mem[usage]');
        const reversed = sorted.reverse();
        // console.log(reversed);
        res.send(reversed);
    })
});



const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
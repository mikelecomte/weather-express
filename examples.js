const courses = [
    { id: 1, name: "accounting" },
    { id: 2, name: "english" },
    { id: 3, name: "programming" }
  ];
  
  app.get("/", (req, res) => {
    res.send("hello world!!!!!");
  });
  
  app.get("/api/courses", (req, res) => {
    res.send(courses);
  });
  
  app.post('/api/courses', (req, res) => {
    if (!req.body.name || req.body.name.length < 3) {
      res.status(400).send('Name is required')
    }
    const course = { 
      id: courses.length + 1,
      name: req.body.name
    };
  
    courses.push(course);
    res.send(course);
  });
  
  app.put('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if (!course) return res.status(404).send("The course was not found");
  
    course.name = req.body.name;
    res.send(course);
  });
  
  app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id))
  
    if (!course) return res.status(404).send("The course was not found");
    res.send(course);
  });
  
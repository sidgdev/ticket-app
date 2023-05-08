#! /usr/bin/env node

console.log(
    'This script populates some records to your database. Specified database as argument eg : node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
  );
  
  // Get arguments passed on command line
  const userArgs = process.argv.slice(2);
  
  const Team = require("./models/team");
  const User = require("./models/user");
  const Ticket = require("./models/ticket");
  
  const teams = [];
  const users = [];
  const tickets = [];
  
  const mongoose = require("mongoose");
  mongoose.set("strictQuery", false); // Prepare for Mongoose 7
  
  const mongoDB = userArgs[0];
  
  main().catch((err) => console.log(err));
  
  async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createTeams();
    await createUsers();
    await createTickets();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
  }
  
  async function teamCreate(team_name, description) {
    const team = new Team({ team_name: team_name, description: description });
    await team.save();
    teams.push(team);
    console.log(`Added team: ${team_name}`);
  }
  
  async function userCreate(user_id, password, first_name, last_name, email, mobile, type, team) {
    userdetail = {  user_id: user_id, 
                    password: password, 
                    first_name: first_name, 
                    last_name: last_name, 
                    email: email,
                    mobile: mobile,
                    type: type,
                    team: team,
                  };  
    const user = new User(userdetail);  
    await user.save();
    users.push(user);
    console.log(`Added user: ${first_name} ${last_name}`);
  }
  
  async function ticketCreate (ticket_id, description, date, assigned_team, status, level, worklog) {
    ticketdetail = {
      ticket_id: ticket_id,
      description: description,
      date: date,
      assigned_team: assigned_team,
      status: status,
      level: level,
      worklog: worklog,
    };  
    const ticket = new Ticket(ticketdetail);
    await ticket.save();
    tickets.push(ticket);
    console.log(`Added ticket: ${ticket_id}`);
  }
    
  async function createTeams() {
    console.log("Adding teams");
    await Promise.all([
      teamCreate("Frontend Team", "Dev team for frontend engineering"),
      teamCreate("Backend Team", "Dev team for backend engineering"),
      teamCreate("Testing Team", "Team for application testing"),
    ]);
  }
  
  async function createUsers() {
    console.log("Adding users");
    await Promise.all([
      userCreate("demo", "demo", "Patrick", "Rothfuss", "demo@gmail.com", "3077652342", "admin", teams[1]),
      userCreate("patrick82", "patrick", "Patrick", "Rothfuss", "patrickr@gmail.com", "8227902810", "admin"),
      userCreate("ben66", "ben", "Ben", "Galway", "beng@gmail.com", "6658912162", "user", teams[0]),
      userCreate("smith80", "smith", "Smith", "Edison", "smithe@gmail.com", "8042637049", "user", teams[1]),
      userCreate("sam64", "sam", "Sam", "Dexter", "samd@gmail.com", "6456306637", "user", teams[2]),
    ]);
  }
  
  async function createTickets() {
    console.log("Adding Books");
    await Promise.all([
      ticketCreate(
        "INC23040034",
        "Testing to be done for new module",
        "2023-04-18",
        teams[2],
        "assigned",
        "low",
      ),
      ticketCreate(
        "INC23040018",
        "Create new web page",
        "2023-04-18",
        teams[0],
        "assigned",
        "moderate",
      ),
    ]);
  }
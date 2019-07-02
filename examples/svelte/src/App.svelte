<script>
  import { Router, Link, Route } from "svelte-routing";
  import Home from "./Home.svelte";
  import Todos from "./Todos.svelte";
  import NavLink from "./NavLink.svelte";
</script>

<Router>
  <nav>
    <NavLink to="/">Home</NavLink>
    <NavLink to="todos">Todos</NavLink>
  </nav>
  <div class="container">
    <Route path="/">
      <Home />
    </Route>
    <Route path="/todos">
      <Todos />
    </Route>
  </div>
</Router>

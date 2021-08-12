import React from "react";
import "./App.scss";
import { createApiClient, Ticket } from "./api";
import Tag from "./components/tag"
import Content from "./components/content"
import TicketClass from "./components/ticket"

export type AppState = {
  tickets?: Ticket[];
  hiddenList: Set<string>;
  search: string;
  hiddenCount: number;
  filteredOut: number;
  currPage: number;
  totalPages: number;
  totalResults: number;
};

const api = createApiClient();

export class App extends React.PureComponent<{}, AppState> {
  state: AppState = {
    hiddenList: new Set<string>(),
    search: "",
    hiddenCount: 0,
    filteredOut: 0,
    currPage: 1,
    totalPages: 0,
    totalResults: 0
  };

  searchDebounce: any = null;

  async componentDidMount() {
    console.log(1);
    this.setState({
      tickets: (await api.getTickets({ reqno: 0 })).tickets,
    });
    console.log(2, this.state.tickets);
  }

  renderTickets = (tickets: Ticket[]) => {
    // TODO: Add counter of how many matching results were hidden.
    // TODO: Make it so the number of found results change according to filter
    const filteredTickets = tickets.filter(
      (t) =>
        (t.title.toLowerCase() + t.content.toLowerCase()).includes(
          this.state.search.toLowerCase()
        ) && (!this.state.hiddenList.has(t.id))
    );
    return (
      <ul className="tickets">
        {filteredTickets.map((ticket) => (
          <TicketClass ticket={ticket} onHide={this.onHide} />
        ))}
      </ul>
    );
  };

  onSearch = async (val: string, newPage?: number) => {
    clearTimeout(this.searchDebounce);

    this.searchDebounce = setTimeout(async () => {
      this.setState({
        search: val,
      });
    }, 300);
  };

  onHide = (ticket: Ticket) => {
    let numHidden = this.state.hiddenCount + 1;
    let hiddenCopy = this.state.hiddenList;
    let id: string = ticket.id;

    hiddenCopy.add(id);

    this.setState({
      hiddenList: hiddenCopy,
      hiddenCount: numHidden,
    });
  };

  onRestore = () => {
    this.setState({ hiddenList: new Set<string>(), hiddenCount: 0 });
  };

  render() {
    const { tickets, hiddenCount } = this.state;

    return (
      <main>
        <h1>Tickets List</h1>
        <header>
          <input
            type="search"
            placeholder="Search..."
            onChange={(e) => this.onSearch(e.target.value)}
          />
        </header>
        {tickets ? (
          <div className="results">
            Showing {tickets.length - hiddenCount} results
            {hiddenCount ? (
              <div className="hidden-res">
                {" "}
                ({hiddenCount} hidden tickets -{" "}
                <a className="restore-button" onClick={this.onRestore}>
                  restore
                </a>
                ){" "}
              </div>
            ) : null}
          </div>
        ) : null}
        {tickets ? this.renderTickets(tickets) : <h2>Loading..</h2>}
      </main>
    );
  }
}

export default App;

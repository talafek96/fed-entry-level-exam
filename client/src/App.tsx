import React from "react";
import "./App.scss";
import { createApiClient, Ticket } from "./api";
import TicketList from "./components/ticketList";

export type AppState = {
  // TODO: Erase unnecessary fields
  tickets?: Ticket[];
  hiddenList: Set<string>;
  search: string;
  hiddenCount: number;
  // filteredOut: number;
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
    // filteredOut: 0,
    currPage: 1,
    totalPages: 0,
    totalResults: 0,
  };

  searchDebounce: any = null;

  async componentDidMount() {
    this.setState({
      tickets: (await api.getTickets({ reqno: 0 })).tickets,
    });
  }

  onSearch = async (val: string, newPage?: number) => {
    clearTimeout(this.searchDebounce);

    this.searchDebounce = setTimeout(async () => {
      this.setState({
        tickets: (
          await api.getTickets({
            reqno: 0,
            search: val,
            page: this.state.currPage,
            hiddenList: this.state.hiddenList,
          })
        ).tickets,
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
        <TicketList
          tickets={tickets}
          totalResults={this.state.totalResults}
          hiddenCount={hiddenCount}
          onHide={this.onHide}
          onRestore={this.onRestore}
        />
      </main>
    );
  }
}

export default App;

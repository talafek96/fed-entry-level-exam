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

  updateDebounce: any = null;

  async componentDidMount() {
    this.updateStateFromServer(undefined, undefined, 0);
  }

  updateStateFromServer = async (
    newSearch?: string,
    newPage?: number,
    numHidden?: number,
    timeout?: number
  ) => {
    clearTimeout(this.updateDebounce);
    let update = {};
    if (newSearch) {
      if (newPage) {
        update = { search: newSearch, page: newPage };
      } else {
        update = { search: newSearch };
      }
    } else if (newPage) {
      update = { page: newPage };
    }

    this.updateDebounce = setTimeout(
      async () => {
        let query = await api.getTickets({
          reqno: 0,
          search: newSearch ? newSearch : this.state.search,
          page: newPage ? newPage : this.state.currPage,
          hiddenList: this.state.hiddenList,
        });
        if (!numHidden) {
          this.setState({
            ...update,
            tickets: query.tickets,
            totalPages: query.pageCount,
            totalResults: query.totalCount,
          });
        } else {
          this.setState({
            ...update,
            hiddenCount: numHidden,
            tickets: query.tickets,
            totalPages: query.pageCount,
            totalResults: query.totalCount,
          });
        }
      },
      timeout ? timeout : 300
    );
  };

  onSearch = (val: string) => {
    this.updateStateFromServer(val, 1);
  };

  onHide = (ticket: Ticket) => {
    let numHidden = this.state.hiddenCount + 1;
    // let hiddenCopy =
    let id: string = ticket.id;
    this.state.hiddenList.add(id);
    this.updateStateFromServer(undefined, undefined, numHidden);
  };

  onRestore = () => {
    this.setState({ hiddenList: new Set<string>(), hiddenCount: 0 });
    this.updateStateFromServer();
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

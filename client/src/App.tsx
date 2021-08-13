import React from "react";
import "./App.scss";
import { createApiClient, Ticket } from "./api";
import TicketList from "./components/ticketList";
import Pagination from "./components/pagination";

export type AppState = {
  tickets?: Ticket[];
  hiddenList: Set<string>;
  search: string;
  hiddenCount: number;
  pageSize: number;
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
    pageSize: 20,
    currPage: 1,
    totalPages: 0,
    totalResults: 0,
  };

  updateDebounce: any = null;

  async componentDidMount() {
    this.updateStateFromServer(false, false, undefined, undefined, 0);
  }

  updateStateFromServer = async (
    updateSearch?: boolean,
    updatePage?: boolean,
    updateHidden?: boolean,
    newSearch?: string,
    newPage?: number,
    numHidden?: number,
    timeout?: number
  ) => {
    clearTimeout(this.updateDebounce);
    let update = {};
    if (newSearch) {
      if (newPage) {
        update = { search: newSearch, currPage: newPage };
      } else {
        update = { search: newSearch };
      }
    } else if (newPage) {
      update = { currPage: newPage };
    }

    this.updateDebounce = setTimeout(
      async () => {
        let query = await api.getTickets({
          reqno: 0,
          search: updateSearch ? newSearch : this.state.search,
          page: updatePage ? newPage : this.state.currPage,
          hiddenList: this.state.hiddenList,
        });
        this.setState({
          ...update,
          tickets: query.tickets,
          totalPages: query.pageCount,
          totalResults: query.totalCount,
          pageSize: query.pageSize,
          search: updateSearch ? newSearch! : this.state.search,
          hiddenCount: updateHidden ? numHidden! : this.state.hiddenCount,
        });
      },
      timeout ? timeout : 300
    );
  };

  onSearch = (val: string) => {
    this.updateStateFromServer(true, true, false, val, 1);
  };
  onHide = (ticket: Ticket) => {
    let numHidden = this.state.hiddenCount + 1;
    // let hiddenCopy =
    let id: string = ticket.id;
    this.state.hiddenList.add(id);
    this.updateStateFromServer(
      false,
      false,
      true,
      undefined,
      undefined,
      numHidden
    );
  };

  onRestore = () => {
    this.setState({ hiddenList: new Set<string>(), hiddenCount: 0 });
    this.updateStateFromServer();
  };

  onPageChange = (newPage: number) => {
    this.updateStateFromServer(false, true, false, undefined, newPage);
  };

  render() {
    const { tickets, currPage, totalPages, hiddenCount } = this.state;

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
        <Pagination
          currPage={currPage}
          totalPages={totalPages}
          onPageChange={this.onPageChange}
        />
        <TicketList
          tickets={tickets}
          totalResults={this.state.totalResults}
          hiddenCount={hiddenCount}
          currPage={this.state.currPage}
          pageSize={this.state.pageSize}
          onHide={this.onHide}
          onRestore={this.onRestore}
        />
      </main>
    );
  }
}

export default App;

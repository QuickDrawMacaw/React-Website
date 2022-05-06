import React, { Component } from 'react';
import { getMovies } from '../services/fakeMovieService';
import ListGroup from './common/listGroup';
import MoviesTables from './moviesTables';

import Pagination from './common/pagination';
import { paginate } from '../utils/paginate';
import { getGenres } from '../services/fakeGenreService';
import _ from 'lodash';
class Movies extends Component {
    state = { 
        movies: [],
        genres: [],
        currentPage: 1,
        pageSize: 4,
        sortColumn: {path: 'title', order: 'asc' }
         
     } ;

     componentDidMount() {
        const genres = [ {_id:'',  name: "All Genres" }, ...getGenres()]

         this.setState({ movies: getMovies(), genres });
     }

     handleDelete = (movie) => {
         console.log(movie)
        const movies = this.state.movies.filter(m => m._id !== movie._id);
        this.setState({ movies });
     };

    handleLike = (movie) => {
        const movies = [...this.state.movies];
        const index = movies.indexOf(movie);
        movies[index] = { ...movies[index] };
        movies[index].liked = !movies[index].liked;
        this.setState({ movies });
    };

    handlePageChange = page => {
        this.setState({ currentPage: page });
        console.log(page)
    }
//filters movies based on their genre
    handleGenreSelect = (genre) => {
        
        this.setState({ selectedGenre: genre, currentPage: 1 });
        console.log(genre)
    }

    handleSort = sortColumn => {
        this.setState({ sortColumn });
    };

    getPagedData = () => {
        const { 
            pageSize, 
            currentPage, 
            sortColumn,
            selectedGenre, 
            movies: allMovies 
        } = this.state;

        const filteredMovies = selectedGenre && selectedGenre._id
        ? allMovies.filter(m => m.genre._id === selectedGenre._id) 
        : allMovies;

    const sorted = _.orderBy(filteredMovies, [sortColumn.path], [sortColumn.order]);

    const movies = paginate(sorted, currentPage, pageSize);

     return { totalCount: filteredMovies.length, data: movies}
    };

     render() {
        const { length: count } = this.state.movies;
        const { 
            pageSize, 
            currentPage, 
            sortColumn,
        } = this.state;

        if ( count === 0) return <p>There are no movies in the database.</p>

        const { totalCount, data: movies } = this.getPagedData();

        return (
            <div className='row'>
                <div className="col-3">
                    <ListGroup 
                        items={this.state.genres} 
                        selectedItem={this.state.selectedGenre}
                        onItemSelect={this.handleGenreSelect} 
                    />
                </div>
                <div className="col">
                    <p>Showing { totalCount } movies in the database.</p>
                    <MoviesTables
                     movies={movies}
                     sortColumn={sortColumn}
                     onDelete={this.handleDelete}
                     onLike={this.handleLike}
                     onSort={this.handleSort} 
                     />
                    <Pagination 
                    itemsCount={totalCount} 
                    pageSize={pageSize}
                    currentPage={currentPage}
                    onPageChange={this.handlePageChange} 
                    />   
                </div>
            </div>
        )}
}
 
export default Movies;
import React, { Component } from 'react';
import { getMovies } from '../services/fakeMovieService';
import ListGroup from './listGroup';
import MoviesTables from './moviesTables';

import Pagination from './pagination';
import { paginate } from '../utils/paginate';
import { getGenres } from '../services/fakeGenreService';
import { filter } from 'lodash';

class Movies extends Component {
    state = { 
        movies: [],
        genres: [],
        currentPage: 1,
        pageSize: 4,
         
     } ;

     componentDidMount() {
        const genres = [{ name: "All Genres" }, ...getGenres()]

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

     render() {
        const { length: count } = this.state.movies;
        const { pageSize, currentPage, selectedGenre ,movies:allMovies } = this.state;

        if ( count === 0) return <p>There are no movies in the database.</p>

        const filteredMovies = selectedGenre && selectedGenre._id
            ? allMovies.filter(m => m.genre._id === selectedGenre._id) 
            : allMovies;

        const movies = paginate(filteredMovies, currentPage, pageSize);

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
                    <p>Showing { filteredMovies.length } movies in the database.</p>
                    <MoviesTables
                     movies={movies}
                     onDelete={this.handleDelete}
                     onLike={this.handleLike} />
                    <Pagination 
                    itemsCount={filteredMovies.length} 
                    pageSize={pageSize}
                    currentPage={currentPage}
                    onPageChange={this.handlePageChange} 
                    />   
                </div>

 
            </div>
        )}
}
 
export default Movies;
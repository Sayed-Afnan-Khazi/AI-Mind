import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import WordCloud from './components/WordCloud/WordCloud';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';

// Particles
import ParticlesWrapper from './components/ParticlesWrapper/ParticlesWrapper';

const initialState = {
    input: '',
    imageUrl: '',
    wordCloudUrl: '',
    route: 'signin', // Initially should go to the signin page
    isSignedIn: false,
    user: {
        id:'',
        name:'',
        email:'',
        entries:0,
        created: ''
    }
}


class App extends Component {

    constructor() {
        super();
        this.state = initialState;
    }

    loadUser = (data) => {
        this.setState({ 
            user: {
                id: data.id,
                name:data.name,
                email:data.email,
                entries:data.entries,
                created: data.created
            }
        });
    }

    // Getting the value of the image link field
    onInputChange = (event) => {
        // console.log(event.target.value);
        this.setState({
            input: event.target.value
        });
    }

    createWordCloudString = (predictions) => {
        // Accepts an array of objects
        // console.log(predictions);
        let wordCloudString = '';
        predictions.forEach(prediction => {
            wordCloudString = wordCloudString + (prediction.name.replace('-',' ') + ' ').repeat(prediction.value*200000)
        });
        // console.log(wordCloudString);
        this.setState({wordCloudUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif?20151024034921'})
        return wordCloudString;
    }

    makeWordCloud = (wordCloudString) => {
        fetch("https://quickchart.io/wordcloud", {
            method: "POST",
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify({
                "format": "svg",
                "width": 300,
                "height": 300,
                "fontFamily": "sans-serif",
                "fontScale": 6,
                "padding": 2,
                "rotation": 5,
                // "useWordList": true,
                "scale": "linear",
                "text": wordCloudString
                }
            )
        })
         .then(res => res.blob()) // Converting the response to a Blob object
         .then(blob => {
            // Create a URL for the Blob
            const wordCloudUrl = URL.createObjectURL(blob);
            this.setState({ wordCloudUrl: wordCloudUrl })
        })
        .catch(err => console.log("Error:", err));
    }


    onButtonSubmit = () => {

        this.setState({
            imageUrl: this.state.input,
        }); // imageUrl set to the current input in the field

        // PAT (Personal Access Token) can be found in the portal under Authentication
        const PAT = '07d0e7d6b128428a947075281a0c94d5';
        // Specify the correct user_id/app_id pairings
        // Since you're making inferences outside your app's scope
        const USER_ID = 'facebook';       
        const APP_ID = 'image-classification';
        // Model and image URL you want to use
        const MODEL_ID = 'general-image-recognition-deit-base';
        const MODEL_VERSION_ID = 'bdfdeb4a60624bce90a4183bf40a69fa'; 
        const IMAGE_URL = this.state.input; // React setState quirk we should be vary of. setState is async.
        // https://medium.com/geekculture/react-setstate-its-async-nature-bc6bcd78eebd

        ///////////////////////////////////////////////////////////////////////////////////
        // YOU DO NOT NEED TO CHANGE ANYTHING BELOW THIS LINE TO RUN THIS EXAMPLE
        ///////////////////////////////////////////////////////////////////////////////////

        const raw = JSON.stringify({
            "user_app_id": {
                "user_id": USER_ID,
                "app_id": APP_ID
            },
            "inputs": [
                {
                    "data": {
                        "image": {
                            "url": IMAGE_URL
                        }
                    }
                }
            ]
        });

        const requestOptions = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Key ' + PAT
            },
            body: raw
        };

        fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
            .then(response => response.json())
            .then(result => this.makeWordCloud(this.createWordCloudString(result.outputs[0].data.concepts)))
            .then(done => {
                fetch('https://smartbrain-api-a9li.onrender.com/image',{
                        method:'put',
                        headers:{'Content-Type':'application/json'},
                        body: JSON.stringify({
                            id:this.state.user.id
                        })
                    })
                        .then(data=>data.json())
                        .then(entries=>this.setState(Object.assign(this.state.user,{entries:entries}))) // Changing a property of an object without re/over-writing the whole object.
                        .catch(err=>console.log);
            })
            .catch(error => console.log('API Error', error));
    }

    // To go from signin -> app or app -> signin
    onRouteChange = (route) => {
        if (route==='signout') {
            this.setState(initialState);
        } else if (route==='home'){
            this.setState({isSignedIn:true});
        }

        this.setState({ route: route});
    }

    render() {
        const { isSignedIn, route } = this.state;
        return (
            <div className="App">
                {/* Had to use a wrapper since we can't init the particles engine (a "hook") in a class component*/}
                <ParticlesWrapper className='particles' />
                <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
                { route === 'home'
                ? <div>
                    <Logo />
                    <Rank user={this.state.user}/>
                    <ImageLinkForm changeFunction={this.onInputChange} submitFunction={this.onButtonSubmit}/>
                    <WordCloud imageUrl={this.state.imageUrl} wordCloudUrl={this.state.wordCloudUrl}/>
                  </div>
                : (
                    this.state.route === 'signin'
                    ? <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
                    : <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
                )
                }
            </div>
        );
    }
}

export default App;

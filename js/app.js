function TrackViewModel() {
    var self = this;

    self.givenTrackName = ko.observable("");
    self.selectedTrack = ko.observable({});
    self.retrievedTracks = ko.observableArray([]);
    self.trackOnSpotify = ko.observable(false);

    self.getTrackAvailability = function(formElement) {
        var spotifySearchEndpoint = "http://ws.spotify.com/search/1/track.json?q=";
        var searchTargetUrl = spotifySearchEndpoint + this.givenTrackName();
        $.ajax(searchTargetUrl).done(function(data) {
            self.retrievedTracks(data.tracks);
            var foundTracks = data.tracks.length > 0;
            self.trackOnSpotify(foundTracks);
            if (!foundTracks) {
                return;
            }

            var track = data.tracks[0];
            var trackTitle = track.name;
            var trackArtist = track.artists[0].name;

            var album = track.album;
            var rawAvailabilityString = album.availability.territories;
            var availability = rawAvailabilityString.split(" ");

            self.selectedTrack({
                title: trackTitle,
                artist: trackArtist,
                numberOfRegions: availability.length
            });

            $('.region-map').vectorMap({
                map: 'world_mill_en',
                selectedRegions: availability
            });
        });
    };
}

$(function() {

    var viewModel = new TrackViewModel();

    ko.applyBindings(viewModel);
});

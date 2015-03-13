
var me = [
    {id: "544546eb2d6125771fc46afe", username:'ur347'},
    {id: "54446e813e1c3d81769d55cb", username:'DR071'}
];

function log(msg) {
    msg = msg || '';
    console.log(msg);
    $('.output').append('<span>'+msg+'</span><br>');
}

$(function() {
    log('*** Users ***');
    log('count: '+users.length);
    log('notMe: '+_.filter(users, function(user) {
        return _.findIndex(me, {id:user.id}) === -1;
    }).length);

    log();
    log('users by number instruments');
    var usersByInstruments = _.sort(users, function() {

    });




    log();
    log('*** Instruments ***')
    log('count '+instruments.length);
    log('notMe: '+_.filter(instruments, function(instrument) {
        return _.findIndex(me, {id:instrument.user}) === -1;
    }).length);

    var instrumentJSONs = _.map(instruments, function(instrument) {
        return JSON.parse(instrument.json);
    });

    var instrumentsPerUser = instruments.length / users.length;
    log('instruments/user: '+instrumentsPerUser);

    var tags = _.reduce(instruments, function(result, instrument) {
        if (instrument.tags)
            Array.prototype.push.apply(result, instrument.tags.split(' '));
        return result;
    }, []);
    log('tags: '+tags.length);
    var uniqueTags = _.uniq(tags);
    log('unique Tags: '+uniqueTags.length)

    log();
    var stars = _.reduce(instruments, function(result, instrument) {
        if (instrument.stars.length)
            Array.prototype.push.apply(result, instrument.stars);
        return result;
    }, []);
    log('stars: '+stars.length);

    var branchedChildren = _.reduce(instruments, function(result, instrument) {
        if (instrument.branchedChildren.length)
            Array.prototype.push.apply(result, instrument.branchedChildren);
        return result;
    }, []);
    log('branchedChildren: '+branchedChildren.length);
    log();

    var generationDepthMax = _.max(instrumentJSONs, 'generation').generation;
    var generationDepthAvg = _.sum(_.map(instrumentJSONs, 'generation'), 'generation') / instrumentJSONs.length;
    log('generation depth: max: '+generationDepthMax+', avg:'+generationDepthAvg);

    var branchedGenerationMax = _.max(instruments, 'branchedGeneration').branchedGeneration;
    var branchedGenerationAvg = _.sum(_.map(instruments, 'branchedGeneration'), 'branchedGeneration') / instruments.length;
    log('generation depth: max: '+branchedGenerationMax+', avg:'+branchedGenerationAvg);
});

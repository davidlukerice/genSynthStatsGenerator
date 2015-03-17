
var me = [
    {id: "544546eb2d6125771fc46afe", username:'ur347'},
    {id: "54446e813e1c3d81769d55cb", username:'DR071'}
];

function log(msg) {
    msg = msg || '';
    console.log(msg);
    $('.output').append('<span>'+msg+'</span><br>');
}

function instrumentsFor(user) {
    return _.filter(instruments, function(instrument) {
        return instrument.user === user.id;
    });
}
function starsForUserInstruments(user) {
    var userInstruments = instrumentsFor(user);
    return _.reduce(userInstruments, function(acc, instrument) {
        return acc + instrument.stars.length;
    }, 0);
}
function branchesForUserInstruments(user) {
    var userInstruments = instrumentsFor(user);
    return _.reduce(userInstruments, function(acc, instrument) {
        return acc + instrument.branchedChildren.length;
    }, 0);
}
function branchedOtherInstruments(user) {
    var userInstruments = instrumentsFor(user);
    return _.filter(userInstruments, function(instrument) {
        return !!instrument.branchedParent;
    }).length;
}


$(function() {
    log('*** Users ***');
    log('count: '+users.length);
    log('notMe: '+_.filter(users, function(user) {
        return _.findIndex(me, {id:user.id}) === -1;
    }).length);

    log();
    log('users by number instruments');
    var usersByInstruments = _.sortBy(users, function(user) {
        return -1*user.instruments.length;
    });
    _.forEach(usersByInstruments, function(user) {
        log(user.username+' '+user.instruments.length);
    });

    log();
    log('users by number stars received for instruments');
    var usersByStarsReceived = _.sortBy(users, function(user) {
        return -1*starsForUserInstruments(user);
    });
    _.forEach(usersByStarsReceived, function(user) {
        log(user.username+' '+starsForUserInstruments(user));
    });

    log();
    log('users by number stars given');
    var usersByStarsGiven = _.sortBy(users, function(user) {
        return -1*user.stars.length;
    });
    _.forEach(usersByStarsGiven, function(user) {
        log(user.username+' '+user.stars.length);
    });

    log();
    log('users by number branches for created instruments');
    var usersByBranchedsReceived = _.sortBy(users, function(user) {
        return -1*branchesForUserInstruments(user);
    });
    _.forEach(usersByBranchedsReceived, function(user) {
        log(user.username+' '+branchesForUserInstruments(user));
    });

    log();
    log('users by number instruments branched from others');
    var usersByBranchesGiven = _.sortBy(users, function(user) {
        return -1*branchedOtherInstruments(user);
    });
    _.forEach(usersByBranchesGiven, function(user) {
        log(user.username+' '+branchedOtherInstruments(user));
    });

    log();
    log('*** Instruments ***')
    log('count '+instruments.length);
    log('notMe: '+_.filter(instruments, function(instrument) {
        return _.findIndex(me, {id:instrument.user}) === -1;
    }).length);

    var publishedInstruments = _.filter(instruments, function(instrument) {
        return !instrument.isPrivate;
    });
    var publishedInstrumentJSONs = _.map(publishedInstruments, function(instrument) {
        return JSON.parse(instrument.json);
    });
    log('published: ' + publishedInstruments.length);

    log('published notMe: ' + _.filter(instruments, function(instrument) {
        return !instrument.isPrivate && _.findIndex(me, {id:instrument.user}) === -1;
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

    var publishedGenDepthMax = _.max(publishedInstrumentJSONs, 'generation').generation;
    var publishedGenDepthAvg = _.sum(_.map(publishedInstrumentJSONs, 'generation'), 'generation') / publishedInstrumentJSONs.length;
    log('published generation depth: max: '+publishedGenDepthMax+', avg:'+publishedGenDepthAvg);

    var branchedGenerationMax = _.max(instruments, 'branchedGeneration').branchedGeneration;
    var branchedGenerationAvg = _.sum(
        _.map(instruments, 'branchedGeneration'),
        'branchedGeneration') / instruments.length;
    log('generation depth: max: '+branchedGenerationMax+', avg:'+branchedGenerationAvg);

    log();
    log('evolution history all');
    var evolutionHistory = _.reduce(_.reduce(instrumentJSONs,
        function(result, instrument) {
            Array.prototype.push.apply(result, instrument.evolutionHistory);
            return result;
        }, []), function(result, evolutionAction) {
            if (result[evolutionAction]) {
                ++result[evolutionAction];
            } else {
                result[evolutionAction] = 1;
            }
            return result;
        }, {});
    _.forEach(evolutionHistory, function(numUsed, action) {
        log(action + ' '+numUsed);
    });
    log();
    log('evolution history published');
    var evolutionHistory = _.reduce(_.reduce(instruments,
        function(result, instrument) {
            if (!instrument.isPrivate) {
                var json = JSON.parse(instrument.json);
                Array.prototype.push.apply(result, json.evolutionHistory);
            }
            return result;
        }, []), function(result, evolutionAction) {
            if (result[evolutionAction]) {
                ++result[evolutionAction];
            } else {
                result[evolutionAction] = 1;
            }
            return result;
        }, {});
    _.forEach(evolutionHistory, function(numUsed, action) {
        log(action + ' '+numUsed);
    });
});

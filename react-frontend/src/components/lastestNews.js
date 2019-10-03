class LatestNews extends Component {

    api = NewsApiClient(api_key=api_key)


    player_name_separated = ' '.join(player_name.split('.'))
    query = 'football ' + player_name_separated
    api_result = api.get_everything(q=query,sort_by='popularity',domains='bleacherreport.com,espn.com')
    top_articles=api_result['articles'][:5]



    render() { 
        return (  );
    }
}
 
export default LatestNews;
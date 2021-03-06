const React = require('react');
const logo = require('../assets/webpack.jpeg');
const colors = require('../assets/colors.svg')
require('./search.less');
// 注释
class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Text: null
    }
  }
  loadComp = () => {
    console.log('click==');
    import('./text.js').then((Text) => {
      console.log('Text: => ', Text);
      this.setState({
        Text: Text.default
      })
    }).catch(err => {
      console.log('error: ', err);
    })
  }
  render() {
    // 注释。。。。。。
    const { Text } = this.state;
    return (
      <div className='search'>
        search content ===
        <img src={colors} />
        <img src={logo} onClick={this.loadComp}/>
        {Text && <Text />}
      </div>
    )
  }
}

// ReactDOM.render(<Search />, document.getElementById('root'));
module.exports = <Search />;
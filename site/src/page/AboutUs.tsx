import './AboutUs.css';

import RegularBG from '../background/RegularBg';
import ImgFrame from '../components/ImgFrame';

import dylan from '../assets/others/dylan.png';

export default function AboutUs() {

  return (
    <RegularBG>
      <div className='heading-large centered'>The Team</div>
      <div id='Dylan' className='section-left'>
        <ImgFrame imgSrc={dylan} imgAlt='picture Dylan' color='black'/>
        <div className='text-container right'>
          <div className='description'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut porttitor pharetra accumsan. Etiam ipsum sapien, finibus at sagittis nec, sagittis in quam. Fusce eu facilisis augue. Mauris eleifend, lectus a ultrices luctus, dui dolor pharetra turpis, ac vehicula neque elit at dui. Donec accumsan diam sed ipsum pretium, non sollicitudin mi sagittis. Quisque laoreet lorem eu mi volutpat efficitur. Pellentesque a ipsum augue. Ut quis enim eu diam viverra pulvinar. Fusce mi quam, molestie non elit eget, faucibus accumsan mi. Phasellus neque massa, viverra vitae arcu non, dictum vehicula augue.
          </div>
          <div className='signature'>
            <div>dbajeux</div>
          </div>
        </div>
      </div>
      <div id='Aurore' className='section-right'>
        <div className='text-container left'>
            <div className='description'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut porttitor pharetra accumsan. Etiam ipsum sapien, finibus at sagittis nec, sagittis in quam. Fusce eu facilisis augue. Mauris eleifend, lectus a ultrices luctus, dui dolor pharetra turpis, ac vehicula neque elit at dui. Donec accumsan diam sed ipsum pretium, non sollicitudin mi sagittis. Quisque laoreet lorem eu mi volutpat efficitur. Pellentesque a ipsum augue. Ut quis enim eu diam viverra pulvinar. Fusce mi quam, molestie non elit eget, faucibus accumsan mi. Phasellus neque massa, viverra vitae arcu non, dictum vehicula augue.
            </div>
            <div className='signature'>
              <div>agaland</div>
            </div>
        </div>
        <ImgFrame
          imgSrc='https://cdn.intra.42.fr/users/4a2a9f9dce90eeef627c357ee393a346/agaland.jpg'
          imgAlt='picture Aurore'
          color='blue'
        />
      </div>
      <div id='Bertrand' className='section-left'>
        <ImgFrame
          imgSrc='https://cdn.intra.42.fr/users/c10b1c69a639cdd5414f6f163518be60/bertrmar.jpg'
          imgAlt='picture Bertrand'
          color='caca'
        />
        <div className='text-container right'>
          <div className='description'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut porttitor pharetra accumsan. Etiam ipsum sapien, finibus at sagittis nec, sagittis in quam. Fusce eu facilisis augue. Mauris eleifend, lectus a ultrices luctus, dui dolor pharetra turpis, ac vehicula neque elit at dui. Donec accumsan diam sed ipsum pretium, non sollicitudin mi sagittis. Quisque laoreet lorem eu mi volutpat efficitur. Pellentesque a ipsum augue. Ut quis enim eu diam viverra pulvinar. Fusce mi quam, molestie non elit eget, faucibus accumsan mi. Phasellus neque massa, viverra vitae arcu non, dictum vehicula augue.
          </div>
          <div className='signature'>
            <div>bertrmar</div>
          </div>
        </div>
      </div>
      
      <div id='Kevin' className='section-right'>
        <div className='text-container left'>
            <div className='description'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut porttitor pharetra accumsan. Etiam ipsum sapien, finibus at sagittis nec, sagittis in quam. Fusce eu facilisis augue. Mauris eleifend, lectus a ultrices luctus, dui dolor pharetra turpis, ac vehicula neque elit at dui. Donec accumsan diam sed ipsum pretium, non sollicitudin mi sagittis. Quisque laoreet lorem eu mi volutpat efficitur. Pellentesque a ipsum augue. Ut quis enim eu diam viverra pulvinar. Fusce mi quam, molestie non elit eget, faucibus accumsan mi. Phasellus neque massa, viverra vitae arcu non, dictum vehicula augue.
            </div>
            <div className='signature'>
              <div>Kprist</div>
            </div>
        </div>
        <ImgFrame
          imgSrc='https://hips.hearstapps.com/hmg-prod/images/gettyimages-2150933231-6641f39e54c8d.jpg?crop=0.6666666666666666xw:1xh;center,top&resize=1120:*'
          imgAlt='picture Kevin'
          color='red'
        />
        
      </div>
      <div id='Simon' className='section-left'>
        <ImgFrame
          imgSrc='https://cdn.intra.42.fr/users/631cec4de555931d34960f24f1b8bfc9/stempels.jpg'
          imgAlt='picture Dylan'
          color='yellow'
        />
        <div className='text-container right'>
          <div className='description'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut porttitor pharetra accumsan. Etiam ipsum sapien, finibus at sagittis nec, sagittis in quam. Fusce eu facilisis augue. Mauris eleifend, lectus a ultrices luctus, dui dolor pharetra turpis, ac vehicula neque elit at dui. Donec accumsan diam sed ipsum pretium, non sollicitudin mi sagittis. Quisque laoreet lorem eu mi volutpat efficitur. Pellentesque a ipsum augue. Ut quis enim eu diam viverra pulvinar. Fusce mi quam, molestie non elit eget, faucibus accumsan mi. Phasellus neque massa, viverra vitae arcu non, dictum vehicula augue.
          </div>
          <div className='signature'>
            <div>Stempels</div>
          </div>
        </div>
      </div>
    </RegularBG>
  )
}
import React from 'react'
import Header from '../components/header'

export default function Legale() {
  return (
    <div>
      <div>
        <Header cur='legal'/>
      </div>
      <div className='md:pl-20 md:pr-20 p-2'>
        <div className='text-center font-medium mt-5'>Mention Legal</div>
        <div className='w-full h-96 bg-blue-100 mt-5 p-4 text-center'>
            <div className=' mt-5'>
              <span className='font-medium text-lg'>Raison sociale:</span>
              <span > Votre Entreprise</span>
            </div>
            <div className='mt-4'>
              <span className='font-medium text-lg mt-10'>Adresse:</span>
              <span> 123 Rue de la legalite, 75001 Paris</span>
            </div>
            <div className='mt-4'>
              <span className='font-medium text-lg'>Telephone:</span>
              <span> +33 123 456 789</span>
            </div>
            <div className='mt-4'>
              <span className='font-medium text-lg mt-5'>Directeur de la publications:</span>
              <span> Votre Nom</span>
            </div>
            <div className='mt-4'>
              <span className='font-medium text-lg mt-5'>Hebergeur:</span>
              <span> Nom de l'hebergeur</span>
            </div>
        </div>
      </div>
    </div>
  )
}

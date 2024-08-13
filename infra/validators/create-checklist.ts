
import * as Yup from 'yup';

const ChecklistSchema = Yup.object({
  farmerName: Yup.string().required('Nome do fazendeiro é obrigatório'),
  farmName: Yup.string().required('Nome da fazenda é obrigatório'),
  farmCity: Yup.string().required('Cidade da fazenda é obrigatória'),
  supervisorName: Yup.string().when('hadSupervision', {
    is: (val:boolean) => val == true,
    then:()=> Yup.string().required('Nome do supervisor é obrigatório'),
    otherwise:()=> Yup.string().notRequired(),
  }),
  checklistType: Yup.string().required('Tipo do checklist é obrigatório'),
  milkProduced: Yup.number().required('Quantidade de leite produzida é obrigatória'),
  numberOfCows: Yup.number().required('Quantidade de cabeça de gado é obrigatória'),
  hadSupervision: Yup.boolean().required('Informe se teve supervisão'),
});

export default ChecklistSchema

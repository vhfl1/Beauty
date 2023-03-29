package kr.co.beauty.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.beauty.dao.MainDAO;
import kr.co.beauty.vo.ProductVO;

@Service
public class MainService {

	@Autowired
	private MainDAO dao;

	public List<ProductVO> selectNewItem() {
		List<ProductVO> vo = dao.selectNewItem();
		for (ProductVO i : vo) {
			String color = i.getColorName();
			if (color != null) {
				String[] arr = color.split(",");
				i.setColorArr(arr);
			}
		}
		return vo;
	}

	public List<ProductVO> selectBestItem(String cate) {
		List<ProductVO> vo = dao.selectBestItem(cate);
		for (ProductVO i : vo) {
			String color = i.getColorName();
			if (color != null) {
				String[] arr = color.split(",");
				i.setColorArr(arr);
			}
		}
		return vo;
	}

	public String countCart(String arg0, String arg1) {
		return dao.countCart(arg0, arg1);
	}

}